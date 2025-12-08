import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getSkills);
router.post("/", addSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
