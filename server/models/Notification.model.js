import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "connection_request",
        "connection_accepted",
        "message",
        "post_like",
        "post_reaction",
        "post_comment",
        "post_share",
        "group_invite",
        "group_join_request",
        "group_accepted",
        "skill_exchange_request",
        "booking_confirmed",
        "payment_received",
        "profile_view",
        "mention",
        "job_application_shortlisted",
        "job_application_accepted",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    link: {
      type: String,
      trim: true,
    },
    targetRoute: {
      type: String,
      trim: true,
    },
    // Parameters for the target route (e.g., { postId: '123', userId: '456' })
    targetParams: {
      type: Map,
      of: String,
    },
    // Additional action data for OneSignal
    actionData: {
      // Action type for client-side handling
      action: {
        type: String,
        enum: [
          "view_post",
          "view_profile",
          "view_network",
          "view_message",
          "view_group",
          "view_booking",
          "view_notification",
          "view_jobs",
          "view_job",
          "custom",
        ],
      },
      // Deep link URL for mobile apps
      deepLink: String,
      // Icon URL for the notification
      icon: String,
      // Image URL for rich notifications
      image: String,
    },
    // Enhanced metadata for different notification types
    metadata: {
      // Post-related notifications
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
      // Group-related notifications
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
      // Comment-related notifications
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
      // Booking-related notifications
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
      // Connection-related notifications
      connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connection",
      },
      // Message-related notifications
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
      // Additional context data
      extraData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
    },
    // OneSignal delivery tracking
    pushId: {
      type: String,
      // OneSignal notification ID
      index: true,
    },
    pushStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed", "cancelled"],
      default: "pending",
    },
    pushSentAt: {
      type: Date,
    },
    pushDeliveredAt: {
      type: Date,
    },
    pushError: {
      type: String,
    },
    // Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    // Click tracking
    isClicked: {
      type: Boolean,
      default: false,
    },
    clickedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ pushStatus: 1, pushSentAt: 1 });

// Auto-delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Instance Methods

/**
 * Generate the target URL for this notification
 * @returns {string} The full URL path to navigate to
 */
notificationSchema.methods.getTargetUrl = function () {
  if (!this.targetRoute) return "/dashboard/notifications";
  let url = this.targetRoute;
  // Replace route parameters with actual values
  if (this.targetParams && this.targetParams.size > 0) {
    this.targetParams.forEach((value, key) => {
      url = url.replace(`:${key}`, value);
    });
  }
  return url;
};

/**
 * Generate OneSignal notification payload
 * @returns {Object} OneSignal notification data
 */
notificationSchema.methods.getOneSignalPayload = function () {
  const payload = {
    headings: { en: this.title },
    contents: { en: this.message },
    data: {
      notificationId: this._id.toString(),
      type: this.type,
      targetRoute: this.targetRoute,
      targetParams: this.targetParams
        ? Object.fromEntries(this.targetParams)
        : {},
      action: this.actionData?.action,
    },
  };

  // Add deep link for mobile apps
  if (this.actionData?.deepLink) {
    payload.app_url = this.actionData.deepLink;
  }

  // Add icon
  if (this.actionData?.icon) {
    payload.small_icon = this.actionData.icon;
    payload.large_icon = this.actionData.icon;
  }

  // Add image for rich notifications
  if (this.actionData?.image) {
    payload.big_picture = this.actionData.image;
    payload.ios_attachments = { image: this.actionData.image };
  }

  return payload;
};

/**
 * Mark notification as read
 */
notificationSchema.methods.markAsRead = function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
  }
  return this.save();
};

/**
 * Mark notification as clicked
 */
notificationSchema.methods.markAsClicked = function () {
  if (!this.isClicked) {
    this.isClicked = true;
    this.clickedAt = new Date();
  }
  // Also mark as read when clicked
  return this.markAsRead();
};

// Static Methods

/**
 * Create notification route configuration based on type
 * @param {string} type - Notification type
 * @param {Object} metadata - Notification metadata
 * @returns {Object} Route configuration { targetRoute, targetParams, actionData }
 */
notificationSchema.statics.getRouteConfig = function (type, metadata = {}) {
  const configs = {
    // Post-related notifications
    post_like: {
      targetRoute: "/dashboard/posts/:postId",
      targetParams: { postId: metadata.postId },
      actionData: {
        action: "view_post",
        deepLink: `talentro://posts/${metadata.postId}`,
      },
    },
    post_reaction: {
      targetRoute: "/dashboard/posts/:postId",
      targetParams: { postId: metadata.postId },
      actionData: {
        action: "view_post",
        deepLink: `talentro://posts/${metadata.postId}`,
      },
    },
    post_comment: {
      targetRoute: "/dashboard/posts/:postId",
      targetParams: { postId: metadata.postId },
      actionData: {
        action: "view_post",
        deepLink: `talentro://posts/${metadata.postId}`,
      },
    },
    post_share: {
      targetRoute: "/dashboard/posts/:postId",
      targetParams: { postId: metadata.postId },
      actionData: {
        action: "view_post",
        deepLink: `talentro://posts/${metadata.postId}`,
      },
    },
    mention: {
      targetRoute: "/dashboard/posts/:postId",
      targetParams: { postId: metadata.postId },
      actionData: {
        action: "view_post",
        deepLink: `talentro://posts/${metadata.postId}`,
      },
    },

    // Connection notifications
    connection_request: {
      targetRoute: "/dashboard/network",
      targetParams: {},
      actionData: {
        action: "view_network",
        deepLink: "talentro://network",
      },
    },
    connection_accepted: {
      targetRoute: "/dashboard/network",
      targetParams: {},
      actionData: {
        action: "view_network",
        deepLink: "talentro://network",
      },
    },

    // Job application notifications
    job_application_shortlisted: {
      targetRoute: "/dashboard/jobs",
      targetParams: {},
      actionData: {
        action: "view_jobs",
        deepLink: metadata.jobId
          ? `talentro://jobs/${metadata.jobId}`
          : "talentro://jobs",
      },
    },
    job_application_accepted: {
      targetRoute: "/dashboard/jobs",
      targetParams: {},
      actionData: {
        action: "view_jobs",
        deepLink: metadata.jobId
          ? `talentro://jobs/${metadata.jobId}`
          : "talentro://jobs",
      },
    },

    // Message notifications
    message: {
      targetRoute: "/dashboard/messages/:conversationId",
      targetParams: { conversationId: metadata.conversationId },
      actionData: {
        action: "view_message",
        deepLink: `talentro://messages/${metadata.conversationId}`,
      },
    },

    // Group notifications
    group_invite: {
      targetRoute: "/dashboard/groups/:groupId",
      targetParams: { groupId: metadata.groupId },
      actionData: {
        action: "view_group",
        deepLink: `talentro://groups/${metadata.groupId}`,
      },
    },
    group_join_request: {
      targetRoute: "/dashboard/groups/:groupId",
      targetParams: { groupId: metadata.groupId },
      actionData: {
        action: "view_group",
        deepLink: `talentro://groups/${metadata.groupId}`,
      },
    },
    group_accepted: {
      targetRoute: "/dashboard/groups/:groupId",
      targetParams: { groupId: metadata.groupId },
      actionData: {
        action: "view_group",
        deepLink: `talentro://groups/${metadata.groupId}`,
      },
    },

    // Booking notifications
    booking_confirmed: {
      targetRoute: "/dashboard/bookings/:bookingId",
      targetParams: { bookingId: metadata.bookingId },
      actionData: {
        action: "view_booking",
        deepLink: `talentro://bookings/${metadata.bookingId}`,
      },
    },

    // Profile view
    profile_view: {
      targetRoute: "/dashboard/profile/:userId",
      targetParams: { userId: metadata.senderId },
      actionData: {
        action: "view_profile",
        deepLink: `talentro://profile/${metadata.senderId}`,
      },
    },

    // Default for other types
    default: {
      targetRoute: "/dashboard/notifications",
      targetParams: {},
      actionData: {
        action: "view_notification",
        deepLink: "talentro://notifications",
      },
    },
  };

  return configs[type] || configs.default;
};

export const Notification = mongoose.model("Notification", notificationSchema);

// Export all models
export default Notification;
