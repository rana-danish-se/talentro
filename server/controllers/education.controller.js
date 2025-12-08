import { Education } from "../models/Education.model.js";

// Get all education records
export const getEducation = async (req, res) => {
  try {
    const education = await Education.find({ userId: req.user.id }).sort({
      startDate: -1,
    });
    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    console.error("Get education error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching education records",
      error: error.message,
    });
  }
};

// Add new education record
export const addEducation = async (req, res) => {
  try {
    const {
      schoolOrUniversity,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isOngoing,
      grade,
      description,
      activities,
    } = req.body;

    const newEducation = new Education({
      userId: req.user.id,
      schoolOrUniversity,
      degree,
      fieldOfStudy,
      startDate,
      endDate: isOngoing ? null : endDate,
      isOngoing,
      grade,
      description,
      activities,
    });

    await newEducation.save();

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      data: newEducation,
    });
  } catch (error) {
    console.error("Add education error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding education record",
      error: error.message,
    });
  }
};

// Update education record
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      schoolOrUniversity,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      isOngoing,
      grade,
      description,
      activities,
    } = req.body;

    const education = await Education.findOne({ _id: id, userId: req.user.id });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    education.schoolOrUniversity =
      schoolOrUniversity || education.schoolOrUniversity;
    education.degree = degree || education.degree;
    education.fieldOfStudy = fieldOfStudy || education.fieldOfStudy;
    education.startDate = startDate || education.startDate;
    education.isOngoing =
      isOngoing !== undefined ? isOngoing : education.isOngoing;
    education.endDate = education.isOngoing
      ? null
      : endDate || education.endDate;
    education.grade = grade || education.grade;
    education.description = description || education.description;
    education.activities = activities || education.activities;

    await education.save();

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    console.error("Update education error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating education record",
      error: error.message,
    });
  }
};

// Delete education record
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting education record",
      error: error.message,
    });
  }
};
