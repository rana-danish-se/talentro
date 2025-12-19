import mongoose from "mongoose";
import Job from "../models/Job.model.js";
import Profile from "../models/Profile.model.js";
import Application from "../models/Application.model.js";
import cloudinary from "../configs/cloudinary.js";

// Helper to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "talentro/jobs",
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

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      industry,
      category,
      mode,
      servicesOffered,
      deadline,
      applicationDeadline,
      removeDate,
      skillsRequired,
      location,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const parsedServicesOffered =
      typeof servicesOffered === "string"
        ? JSON.parse(servicesOffered)
        : servicesOffered || [];
    const parsedSkillsRequired =
      typeof skillsRequired === "string"
        ? JSON.parse(skillsRequired)
        : skillsRequired || [];
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    // Parse mode if it's a string (FormData often sends arrays as JSON strings or repeated keys, but here we assume JSON string if creating via our frontend logic)
    let parsedMode = mode;
    if (typeof mode === "string") {
      try {
        parsedMode = JSON.parse(mode);
      } catch (e) {
        // If it's a simple string like "paid", wrap in array
        parsedMode = [mode];
      }
    }
    if (!Array.isArray(parsedMode)) {
      parsedMode = [parsedMode];
    }

    const attachmentUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Since we are using CloudinaryStorage in multer utility,
        // the file is already uploaded and file.path contains the URL.
        if (file.path) {
          attachmentUrls.push(file.path);
        } else if (file.buffer) {
          try {
            const result = await uploadToCloudinary(file.buffer, "auto");
            attachmentUrls.push(result.secure_url);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
          }
        }
      }
    }

    const jobData = {
      userId: req.user.id,
      title,
      description,
      industry: industry || undefined,
      category: category || undefined,
      mode: parsedMode || ["paid"],
      servicesOffered:
        parsedServicesOffered.length > 0 ? parsedServicesOffered : undefined,
      deadline: deadline || undefined,
      applicationDeadline: applicationDeadline || undefined,
      removeDate: removeDate || undefined,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      skillsRequired:
        parsedSkillsRequired.length > 0 ? parsedSkillsRequired : undefined,
      location: parsedLocation || undefined,
    };

    const job = await Job.create(jobData);
    await job.populate("userId", "firstName lastName profileImage headline");
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      industry,
      category,
      mode,
      search,
    } = req.query;

    const query = { status: "active" };

    // Add filters
    if (industry) query.industry = industry;
    if (category) query.category = category;
    if (mode) query.mode = mode;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("userId", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const jobs = await Job.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(jobId),
        },
      },
      // Lookup user details
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      // Lookup profile details
      {
        $lookup: {
          from: "profiles",
          localField: "userId",
          foreignField: "userId",
          as: "profileDetails",
        },
      },
      {
        $unwind: {
          path: "$profileDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup application count
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $addFields: {
          totalApplications: { $size: "$applications" },
        },
      },
      // Project final structure
      {
        $project: {
          // Job fields
          _id: 1,
          title: 1,
          description: 1,
          industry: 1,
          category: 1,
          mode: 1,
          servicesOffered: 1,
          skillsRequired: 1,
          deadline: 1,
          applicationDeadline: 1,
          removeDate: 1,
          location: 1,
          attachments: 1,
          status: 1,
          views: 1,
          createdAt: 1,
          updatedAt: 1,
          totalApplications: 1,
          // User/Client info
          userId: {
            _id: "$userDetails._id",
            firstName: "$profileDetails.firstName",
            lastName: "$profileDetails.lastName",
            slug: "$userDetails.slug",
            profileImage: "$profileDetails.profileImage",
            headline: "$profileDetails.headline",
            industry: "$profileDetails.industry",
            location: "$profileDetails.location",
          },
        },
      },
    ]);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const job = jobs[0];

    // Increment view count
    await Job.findByIdAndUpdate(jobId, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns the job
    if (job.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const {
      title,
      description,
      industry,
      category,
      mode,
      servicesOffered,
      deadline,
      applicationDeadline,
      removeDate,
      skillsRequired,
      location,
      status,
    } = req.body;

    // Parse JSON strings
    const parsedServicesOffered =
      typeof servicesOffered === "string"
        ? JSON.parse(servicesOffered)
        : servicesOffered || job.servicesOffered;
    const parsedSkillsRequired =
      typeof skillsRequired === "string"
        ? JSON.parse(skillsRequired)
        : skillsRequired || job.skillsRequired;
    const parsedLocation =
      typeof location === "string"
        ? JSON.parse(location)
        : location || job.location;

    let parsedMode = mode;
    if (typeof mode === "string") {
      try {
        parsedMode = JSON.parse(mode);
      } catch (e) {
        parsedMode = [mode];
      }
    } else if (!mode) {
      parsedMode = job.mode;
    }

    // Ensure array
    if (parsedMode && !Array.isArray(parsedMode)) {
      parsedMode = [parsedMode];
    }

    // Handle attachments
    let attachmentUrls = [];

    // 1. Keep existing attachments that were sent back
    if (req.body.existingAttachments) {
      try {
        const existing = JSON.parse(req.body.existingAttachments);
        if (Array.isArray(existing)) {
          attachmentUrls = existing;
        }
      } catch (e) {
        console.error("Error parsing existingAttachments:", e);
        attachmentUrls = [...(job.attachments || [])];
      }
    } else {
      attachmentUrls = [...(job.attachments || [])];
    }

    // 2. Add new uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.path) {
          attachmentUrls.push(file.path);
        } else if (file.buffer) {
          try {
            const result = await uploadToCloudinary(file.buffer, "auto");
            attachmentUrls.push(result.secure_url);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
          }
        }
      }
    }

    // Update fields
    job.title = title || job.title;
    job.description = description || job.description;
    job.industry = industry || job.industry;
    job.category = category || job.category;
    job.mode = parsedMode || job.mode;
    job.servicesOffered = parsedServicesOffered;
    job.deadline = deadline || job.deadline;
    job.applicationDeadline = applicationDeadline || job.applicationDeadline;
    job.removeDate = removeDate || job.removeDate;
    job.skillsRequired = parsedSkillsRequired;
    job.location = parsedLocation;
    job.attachments = attachmentUrls;
    job.status = status || job.status;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user owns the job
    if (job.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

export const getUserJobsSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const { industry, location } = profile;
    const city = location?.city;
    const country = location?.country;

    const jobs = await Job.aggregate([
      {
        $match: {
          status: "active",
          userId: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              {
                $cond: [
                  {
                    $eq: [
                      { $toLower: "$industry" },
                      industry ? industry.toLowerCase() : "",
                    ],
                  },
                  10,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $eq: [
                      { $toLower: "$location.city" },
                      city ? city.toLowerCase() : "",
                    ],
                  },
                  5,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $eq: [
                      { $toLower: "$location.country" },
                      country ? country.toLowerCase() : "",
                    ],
                  },
                  2,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: {
          score: -1,
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $lookup: {
          from: "profiles",
          localField: "userId",
          foreignField: "userId",
          as: "profileDetails",
        },
      },
      {
        $unwind: {
          path: "$profileDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          industry: 1,
          category: 1,
          mode: 1,
          servicesOffered: 1,
          skillsRequired: 1,
          deadline: 1,
          applicationDeadline: 1,
          location: 1,
          attachments: 1,
          status: 1,
          views: 1,
          createdAt: 1,
          userId: {
            _id: "$userDetails._id",
            profileImage: "$profileDetails.profileImage",
            firstName: "$profileDetails.firstName",
            lastName: "$profileDetails.lastName",
            slug: "$userDetails.slug",
          },
          score: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching job suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job suggestions",
      error: error.message,
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobs = await Job.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
        },
      },
      {
        $project: {
          applications: 0, // Exclude the applications array to keep response light
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching my jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
      error: error.message,
    });
  }
};

export const getMyJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.user.id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or unauthorized",
      });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate("applicantId", "email") // Populate email from User model if needed, or just keep ID
      .sort({ createdAt: -1 });

    // Manually fetch profiles for applicants
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await Profile.findOne({
          userId: app.applicantId._id,
        }).select("firstName lastName profileImage headline");

        // Create a plain object to modify
        const appObj = app.toObject();

        // Attach profile data to applicantId object
        if (profile) {
          appObj.applicantId = {
            ...appObj.applicantId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            profileImage: profile.profileImage,
            headline: profile.headline,
          };
        } else {
          // Fallback if profile not found
          appObj.applicantId = {
            ...appObj.applicantId,
            firstName: "Unknown",
            lastName: "User",
            profileImage: null,
            headline: "",
          };
        }
        return appObj;
      })
    );

    res.status(200).json({
      success: true,
      data: {
        job,
        applications: applicationsWithProfiles,
      },
    });
  } catch (error) {
    console.error("Error fetching my job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job details",
      error: error.message,
    });
  }
};
