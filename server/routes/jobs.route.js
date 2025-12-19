import express from "express";
import upload from "../utils/multer.js";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getUserJobsSuggestions,
  getMyJobs,
  getMyJobById,
} from "../controllers/jobs.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/create", protect, upload.array("attachments", 4), createJob);
router.get("/", getAllJobs);
router.get("/my-jobs", protect, getMyJobs);
router.get("/my-jobs/:id", protect, getMyJobById);
router.get("/suggestions", protect, getUserJobsSuggestions);
router.get("/:id", getJobById);
router.put("/:id", protect, upload.array("attachments", 4), updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
