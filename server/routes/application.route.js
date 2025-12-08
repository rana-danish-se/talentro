import express from "express";
import multer from "multer";
import {
  applyForJob,
  getApplicationById,
  checkApplicationStatus,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
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

router.post("/apply/:id", protect, upload.array("attachments", 4), applyForJob);
router.get("/check-status/:jobId", protect, checkApplicationStatus);
router.get("/:id", protect, getApplicationById);
router.put("/status/:id", protect, updateApplicationStatus);

export default router;
