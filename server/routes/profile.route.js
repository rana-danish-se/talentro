import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  getUserProfile,
  updateProfile,
  addProfile,
  updateProfileImage,
  updatePosterImage,
} from "../controllers/profile.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Protected routes
router.use(protect);
router.get("/me",protect, getProfile);
router.post("/add", addProfile);
router.put("/update", updateProfile);
router.put("/image", upload.single("image"), updateProfileImage);
router.put("/poster", upload.single("image"), updatePosterImage);

// Public routes (must be last to avoid collision with /me)
router.get("/:userId", getUserProfile);

export default router;
