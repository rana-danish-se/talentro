import express from "express";
import multer from "multer";
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
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, PDFs, and Word documents are allowed."
        )
      );
    }
  },
});
router.post("/create", protect, upload.array("attachments", 4), createJob);
router.get("/", getAllJobs);
router.get("/my-jobs", protect, getMyJobs);
router.get("/my-jobs/:id", protect, getMyJobById);
router.get("/suggestions", protect, getUserJobsSuggestions);
router.get("/:id", getJobById);
router.put("/:id", protect, upload.array("attachments", 4), updateJob);
router.delete("/:id", protect, deleteJob);

export default router;
