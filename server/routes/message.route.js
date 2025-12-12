import express from "express";
import {
  sendMessage,
  getSentMessages,
  getReceivedMessages,
} from "../controllers/message.controller.js";
import { protect as verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken); // Apply auth middleware to all routes

router.post("/send", sendMessage);
router.get("/sent", getSentMessages);
router.get("/received", getReceivedMessages);

export default router;
