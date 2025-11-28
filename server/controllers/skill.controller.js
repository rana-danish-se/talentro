import { Skill } from "../models/Skill.model.js";
import { categorizeSkill } from "../utils/skillCategories.js";

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSkill = async (req, res) => {
  try {
    const { name, proficiencyLevel, yearsOfExperience } = req.body;

    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({
      userId: req.user.id,
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists in your profile",
      });
    }

    const category = categorizeSkill(name);

    const newSkill = new Skill({
      userId: req.user.id,
      name,
      category,
      proficiencyLevel,
      yearsOfExperience,
    });

    await newSkill.save();
    res.status(201).json({ success: true, data: newSkill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, proficiencyLevel, yearsOfExperience } = req.body;

    const skill = await Skill.findOne({ _id: id, userId: req.user.id });

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    if (name && name !== skill.name) {
      skill.name = name;
      skill.category = categorizeSkill(name); // Re-compute category if name changes
    }

    if (proficiencyLevel) skill.proficiencyLevel = proficiencyLevel;
    if (yearsOfExperience) skill.yearsOfExperience = yearsOfExperience;

    await skill.save();

    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
