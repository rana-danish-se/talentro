import { Project } from "../models/Project.model.js";
import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "talentro/projects",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addProject = async (req, res) => {
  try {
    const {
      name,
      description,
      projectUrl,
      githubUrl,
      skillsUsed,
      startDate,
      endDate,
      isOngoing,
    } = req.body;

    let media = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      const results = await Promise.all(uploadPromises);
      media = results.map((result) => ({
        type: "image",
        url: result.secure_url,
      }));
    }

    const newProject = new Project({
      userId: req.user.id,
      name,
      description,
      projectUrl,
      githubUrl,
      skillsUsed: Array.isArray(skillsUsed)
        ? skillsUsed
        : JSON.parse(skillsUsed || "[]"),
      startDate,
      endDate,
      isOngoing: isOngoing === "true",
      media,
    });

    await newProject.save();
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      projectUrl,
      githubUrl,
      skillsUsed,
      startDate,
      endDate,
      isOngoing,
      existingMedia,
    } = req.body;

    const project = await Project.findOne({ _id: id, userId: req.user.id });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Handle existing media
    let updatedMedia = [];
    if (existingMedia) {
      try {
        const parsedExisting = JSON.parse(existingMedia);
        if (Array.isArray(parsedExisting)) {
          updatedMedia = parsedExisting.map((url) => ({ type: "image", url }));
        }
      } catch (e) {
        console.error("Error parsing existingMedia:", e);
      }
    }

    // Handle new files
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      const results = await Promise.all(uploadPromises);
      const newMedia = results.map((result) => ({
        type: "image",
        url: result.secure_url,
      }));
      updatedMedia = [...updatedMedia, ...newMedia];
    }

    // Update fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.projectUrl = projectUrl || project.projectUrl;
    project.githubUrl = githubUrl || project.githubUrl;
    if (skillsUsed) {
      project.skillsUsed = Array.isArray(skillsUsed)
        ? skillsUsed
        : JSON.parse(skillsUsed);
    }
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (typeof isOngoing !== "undefined") {
      project.isOngoing = isOngoing === "true";
    }

    if (existingMedia || (req.files && req.files.length > 0)) {
      project.media = updatedMedia;
    }

    await project.save();
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
