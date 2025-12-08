import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experience.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getExperience);
router.post("/", addExperience);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;
