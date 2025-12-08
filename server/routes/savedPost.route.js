import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  toggleSavePost,
  getSavedPosts,
  checkIsSaved,
} from "../controllers/savedPost.controller.js";

const router = express.Router();

// Protected routes
router.use(protect);

router.post("/:postId", toggleSavePost);
router.get("/", getSavedPosts);
router.get("/:postId/check", checkIsSaved);

export default router;
