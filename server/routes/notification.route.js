import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsClicked,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Get user's notifications
router.get("/",protect, getNotifications);

// Get unread count
router.get("/unread-count",protect, getUnreadCount);

// Mark all as read
router.patch("/mark-all-read",protect, markAllAsRead);

// Mark specific notification as read
router.patch("/:notificationId/read",protect, markAsRead);

// Mark specific notification as clicked
router.post("/:notificationId/click",protect, markAsClicked);

export default router;
