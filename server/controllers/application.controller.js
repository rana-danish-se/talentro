import Application from "../models/Application.model.js";
import Job from "../models/Job.model.js";
import Profile from "../models/Profile.model.js";
import User from "../models/User.model.js";
import cloudinary from "../configs/cloudinary.js";

// Helper to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "talentro/applications",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposal, estimatedDuration, selectedMode } = req.body;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is applying to their own job
    if (job.userId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job",
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId: id,
      applicantId: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Handle attachments
    const attachmentUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const resourceType = file.mimetype.startsWith("image")
            ? "image"
            : "raw";
          const result = await uploadToCloudinary(file.buffer, resourceType);
          attachmentUrls.push(result.secure_url);
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
        }
      }
    }

    const application = await Application.create({
      jobId: id,
      applicantId: userId,
      proposal,
      estimatedDuration,
      selectedMode,
      attachments: attachmentUrls,
    });

    // Increment total applications count for user
    await User.findByIdAndUpdate(userId, {
      $inc: { totalApplications: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId", "title description status")
      .populate("applicantId", "email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Manually fetch profile for applicant
    const profile = await Profile.findOne({
      userId: application.applicantId._id,
    }).select("firstName lastName profileImage headline");

    const appData = application.toObject();

    if (profile) {
      appData.applicantId = {
        ...appData.applicantId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profileImage: profile.profileImage,
        headline: profile.headline,
      };
    } else {
      appData.applicantId = {
        ...appData.applicantId,
        firstName: "Unknown",
        lastName: "User",
        profileImage: null,
        headline: "",
      };
    }

    res.status(200).json({
      success: true,
      data: appData,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};

export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      applicantId: userId,
    });

    res.status(200).json({
      success: true,
      data: {
        hasApplied: !!existingApplication,
      },
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check application status",
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const application = await Application.findById(id).populate("jobId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if the user is the owner of the job
    const job = await Job.findById(application.jobId._id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Associated job not found",
      });
    }

    console.log("Debug Auth:", {
      reqUserId: userId,
      jobUserId: job.userId,
      jobUserIdString: job.userId.toString(),
      isMatch: job.userId.toString() === userId,
    });

    if (job.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application status",
      });
    }

    // Validate status
    const validStatuses = ["pending", "shortlisted", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const oldStatus = application.status;

    // Update statistics if status changed
    if (oldStatus !== status) {
      const updateQuery = {};

      // Handle old status (decrement if needed)
      if (oldStatus === "shortlisted") {
        updateQuery.shortlistedCount = -1;
      } else if (oldStatus === "accepted") {
        updateQuery.acceptedCount = -1;
      }

      // Handle new status (increment if needed)
      if (status === "shortlisted") {
        updateQuery.shortlistedCount = (updateQuery.shortlistedCount || 0) + 1;
      } else if (status === "accepted") {
        updateQuery.acceptedCount = (updateQuery.acceptedCount || 0) + 1;
      }

      // Perform update if query is not empty
      if (Object.keys(updateQuery).length > 0) {
        await User.findByIdAndUpdate(application.applicantId, {
          $inc: updateQuery,
        });
      }
    }

    application.status = status;
    await application.save();

    // Send notification to applicant when status changes to shortlisted or accepted
    if (
      oldStatus !== status &&
      (status === "shortlisted" || status === "accepted")
    ) {
      try {
        const notificationService = (
          await import("../services/notification.service.js")
        ).default;

        // Determine notification  type and message
        const notifType =
          status === "shortlisted"
            ? "job_application_shortlisted"
            : "job_application_accepted";
        const title =
          status === "shortlisted"
            ? "Application Shortlisted!"
            : "Application Accepted!";
        const message =
          status === "shortlisted"
            ? `Your application for "${job.title}" has been shortlisted!`
            : `Congratulations! Your application for "${job.title}" has been accepted!`;

        await notificationService.createAndSendNotification({
          recipientId: application.applicantId.toString(),
          senderId: userId,
          type: notifType,
          title,
          message,
          metadata: {
            jobId: job._id.toString(),
            applicationId: application._id.toString(),
            jobTitle: job.title,
          },
        });
      } catch (notifError) {
        console.error(
          "Failed to send job application notification:",
          notifError
        );
        // Don't fail the request if notification fails
      }
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};
