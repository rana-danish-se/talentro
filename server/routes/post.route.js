import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
import {
  createPost,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/userPost.controller.js";
import { reactToPost } from "../controllers/reaction.controller.js";
import {
  addComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Protected routes
router.use(protect);

// Post creation (with media upload)
router.post("/create", upload.array("media", 4), createPost);

// Post interactions
router.post("/:postId/react", reactToPost);
router.post("/:postId/comment", addComment);
router.get("/:postId/comments", getPostComments);
router.post("/comments/:commentId/like", likeComment);

// Post management
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

// Get single post
router.get("/:postId", getPostById);

// User feed/posts (Public or Protected depending on logic, keeping protected for now as per use(protect))
router.get("/user/:userId", getUserPosts);

export default router;
