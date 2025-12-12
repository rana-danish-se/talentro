import express from "express";
import { getUserBySlug, searchUsers } from "../controllers/user.controller.js";
import { protect as verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/search", verifyToken, searchUsers);
router.get("/:slug", getUserBySlug);

export default router;
