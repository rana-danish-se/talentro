import { Experience } from "../models/Experience.model.js";

export const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find({ userId: req.user.id }).sort({
      startDate: -1,
    });
    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const newExperience = new Experience({
      ...req.body,
      userId: req.user.id,
    });
    await newExperience.save();
    res.status(201).json({ success: true, data: newExperience });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    Object.assign(experience, req.body);
    await experience.save();

    res.status(200).json({ success: true, data: experience });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!experience) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
