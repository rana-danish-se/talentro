import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/education.controller.js";

const router = express.Router();

router.use(protect);

router.get("/",protect, getEducation);
router.post("/",protect, addEducation);
router.put("/:id",protect, updateEducation);
router.delete("/:id",protect, deleteEducation);

export default router;
