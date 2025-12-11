import Notification from "../models/Notification.model.js";
import oneSignalService from "./oneSignal.service.js";
import Profile from "../models/Profile.model.js";

/**
 * Notification Service
 * Handles creation and delivery of notifications
 */

class NotificationService {
  /**
   * Create and send a notification
   * @param {Object} options - Notification options
   * @param {string} options.recipientId - User receiving the notification
   * @param {string} options.senderId - User triggering the notification (optional)
   * @param {string} options.type - Notification type
   * @param {string} options.title - Notification title
   * @param {string} options.message - Notification message
   * @param {Object} options.metadata - Additional metadata
   * @param {boolean} options.sendPush - Whether to send push notification (default: true)
   * @returns {Promise<Object>} Created notification
   */
  async createAndSendNotification({
    recipientId,
    senderId = null,
    type,
    title,
    message,
    metadata = {},
    sendPush = true,
  }) {
    try {
      // Get route configuration for the notification type
      const routeConfig = Notification.getRouteConfig(type, {
        ...metadata,
        senderId,
      });

      // Create notification in database
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type,
        title,
        message,
        targetRoute: routeConfig.targetRoute,
        targetParams: routeConfig.targetParams,
        actionData: routeConfig.actionData,
        metadata,
        pushStatus: sendPush ? "pending" : "cancelled",
      });

      // Send push notification if enabled
      if (sendPush) {
        try {
          const oneSignalPayload = notification.getOneSignalPayload();
          const result = await oneSignalService.sendNotificationToUser(
            recipientId,
            oneSignalPayload
          );

          // Update notification with OneSignal response
          if (result && !result.skipped) {
            notification.pushId = result.id;
            notification.pushStatus = "sent";
            notification.pushSentAt = new Date();
          } else if (result && result.skipped) {
            notification.pushStatus = "cancelled";
            notification.pushError = result.reason;
          }
          await notification.save();
        } catch (pushError) {
          console.error("Failed to send push notification:", pushError);
          notification.pushStatus = "failed";
          notification.pushError = pushError.message;
          await notification.save();
        }
      }

      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  }

  /**
   * Create a notification for post like
   * @param {string} postId - Post ID
   * @param {string} postAuthorId - Post author ID
   * @param {string} likerId - User who liked the post
   * @returns {Promise<Object>} Created notification
   */
  async createPostLikeNotification(postId, postAuthorId, likerId) {
    // Don't notify if user likes their own post
    if (postAuthorId.toString() === likerId.toString()) {
      return null;
    }

    // Get liker's profile for the notification message
    const likerProfile = await Profile.findOne({ userId: likerId });
    const likerName = likerProfile
      ? `${likerProfile.firstName} ${likerProfile.lastName}`.trim()
      : "Someone";

    return await this.createAndSendNotification({
      recipientId: postAuthorId,
      senderId: likerId,
      type: "post_like",
      title: "New Like on Your Post",
      message: `${likerName} liked your post`,
      metadata: {
        postId,
      },
    });
  }

  /**
   * Create a notification for post comment
   * @param {string} postId - Post ID
   * @param {string} postAuthorId - Post author ID
   * @param {string} commenterId - User who commented
   * @param {string} commentId - Comment ID
   * @param {string} commentContent - Comment content preview
   * @returns {Promise<Object>} Created notification
   */
  async createPostCommentNotification(
    postId,
    postAuthorId,
    commenterId,
    commentId,
    commentContent = ""
  ) {
    // Don't notify if user comments on their own post
    if (postAuthorId.toString() === commenterId.toString()) {
      return null;
    }

    // Get commenter's profile for the notification message
    const commenterProfile = await Profile.findOne({ userId: commenterId });
    const commenterName = commenterProfile
      ? `${commenterProfile.firstName} ${commenterProfile.lastName}`.trim()
      : "Someone";

    // Truncate comment content for the message
    const preview =
      commentContent.length > 50
        ? commentContent.substring(0, 50) + "..."
        : commentContent;

    return await this.createAndSendNotification({
      recipientId: postAuthorId,
      senderId: commenterId,
      type: "post_comment",
      title: "New Comment on Your Post",
      message: `${commenterName} commented: ${preview}`,
      metadata: {
        postId,
        commentId,
      },
    });
  }

  /**
   * Create a notification for connection request
   * @param {string} recipientId - User receiving the request
   * @param {string} requesterId - User sending the request
   * @param {string} connectionId - Connection ID
   * @returns {Promise<Object>} Created notification
   */
  async createConnectionRequestNotification(
    recipientId,
    requesterId,
    connectionId
  ) {
    const requesterProfile = await Profile.findOne({ userId: requesterId });
    const requesterName = requesterProfile
      ? `${requesterProfile.firstName} ${requesterProfile.lastName}`.trim()
      : "Someone";

    return await this.createAndSendNotification({
      recipientId,
      senderId: requesterId,
      type: "connection_request",
      title: "New Connection Request",
      message: `${requesterName} wants to connect with you`,
      metadata: {
        connectionId,
      },
    });
  }

  /**
   * Create a notification for connection accepted
   * @param {string} recipientId - User who sent the original request
   * @param {string} accepterId - User who accepted the request
   * @param {string} connectionId - Connection ID
   * @returns {Promise<Object>} Created notification
   */
  async createConnectionAcceptedNotification(
    recipientId,
    accepterId,
    connectionId
  ) {
    const accepterProfile = await Profile.findOne({ userId: accepterId });
    const accepterName = accepterProfile
      ? `${accepterProfile.firstName} ${accepterProfile.lastName}`.trim()
      : "Someone";

    return await this.createAndSendNotification({
      recipientId,
      senderId: accepterId,
      type: "connection_accepted",
      title: "Connection Request Accepted",
      message: `${accepterName} accepted your connection request`,
      metadata: {
        connectionId,
        senderId: accepterId,
      },
    });
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (to verify ownership)
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return await notification.markAsRead();
  }

  /**
   * Mark notification as clicked
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (to verify ownership)
   * @returns {Promise<Object>} Updated notification
   */
  async markAsClicked(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    return await notification.markAsClicked();
  }

  /**
   * Get user's notifications with pagination
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {boolean} options.unreadOnly - Return only unread notifications
   * @returns {Promise<Object>} Notifications with pagination
   */
  async getUserNotifications(
    userId,
    { page = 1, limit = 20, unreadOnly = false } = {}
  ) {
    const skip = (page - 1) * limit;
    const query = { recipient: userId };

    if (unreadOnly) {
      query.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "email")
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    // Populate sender details with Profile
    const senderIds = notifications
      .map((n) => n.sender)
      .filter(Boolean)
      .map((s) => s._id);

    const profiles = await Profile.find({ userId: { $in: senderIds } })
      .select("userId firstName lastName profileImage headline")
      .lean();

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.userId.toString()] = profile;
      return acc;
    }, {});

    // Enhance notifications with sender profiles
    const enhancedNotifications = notifications.map((notification) => {
      if (notification.sender) {
        const profile = profileMap[notification.sender._id.toString()];
        if (profile) {
          notification.sender = {
            ...notification.sender,
            firstName: profile.firstName,
            lastName: profile.lastName,
            fullName: `${profile.firstName} ${profile.lastName}`.trim(),
            profileImage: profile.profileImage,
            headline: profile.headline,
          };
        }
      }
      return notification;
    });

    return {
      notifications: enhancedNotifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Update result
   */
  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return result;
  }
}

export default new NotificationService();
