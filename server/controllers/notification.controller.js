import notificationService from "../services/notification.service.js";

/**
 * Get user's notifications
 * @route GET /api/notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const unreadOnly = req.query.unreadOnly === "true";

    const result = await notificationService.getUserNotifications(userId, {
      page,
      limit,
      unreadOnly,
    });

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result.notifications,
      pagination: result.pagination,
      unreadCount: result.unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

/**
 * Get unread notifications count
 * @route GET /api/notifications/unread-count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { unreadCount } = await notificationService.getUserNotifications(
      userId,
      {
        page: 1,
        limit: 1,
      }
    );

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

/**
 * Mark a notification as read
 * @route PATCH /api/notifications/:notificationId/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await notificationService.markAsRead(
      notificationId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(error.message === "Notification not found" ? 404 : 500).json({
      success: false,
      message: error.message || "Error marking notification as read",
    });
  }
};

/**
 * Mark a notification as clicked
 * @route POST /api/notifications/:notificationId/click
 */
export const markAsClicked = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await notificationService.markAsClicked(
      notificationId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as clicked",
      data: notification,
    });
  } catch (error) {
    console.error("Mark as clicked error:", error);
    res.status(error.message === "Notification not found" ? 404 : 500).json({
      success: false,
      message: error.message || "Error marking notification as clicked",
    });
  }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/mark-all-read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking all notifications as read",
      error: error.message,
    });
  }
};
