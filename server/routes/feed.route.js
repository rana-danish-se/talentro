import express from "express";
import { getFeed } from "../controllers/feed.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/", protect, getFeed);
export default router;
