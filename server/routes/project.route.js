import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.use(protect);

router.get("/",protect, getProjects);
router.post("/",protect, upload.array("images", 4), addProject);
router.put("/:id",protect, upload.array("images", 4), updateProject);
router.delete("/:id",protect, deleteProject);

export default router;
