import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  getUserProfile,
  updateProfile,
  addProfile,
  updateProfileImage,
  updatePosterImage,
  getContactInfo,
  updateContactInfo,
  getAbout,
  updateAbout,
} from "../controllers/profile.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Protected routes
router.use(protect);
router.get("/me", protect, getProfile);
router.post("/add", protect, addProfile);
router.put("/update", protect, updateProfile);
router.put("/image", upload.single("image"), protect, updateProfileImage);
router.put("/poster", upload.single("image"), protect, updatePosterImage);
router.get("/contact", protect, getContactInfo);
router.put("/contact", protect, updateContactInfo);
router.get("/about", protect, getAbout);
router.put("/about", protect, updateAbout);

// Public routes (must be last to avoid collision with /me)
router.get("/:userId", getUserProfile);

export default router;
