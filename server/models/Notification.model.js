// ============================================
// Notification.model.js
// ============================================
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'connection_request',
        'connection_accepted',
        'message',
        'post_like',
        'post_reaction',
        'post_comment',
        'post_share',
        'group_invite',
        'group_join_request',
        'group_accepted',
        'skill_exchange_request',
        'booking_confirmed',
        'payment_received',
        'profile_view',
        'mention',
        'system',
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
    metadata: {
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
      commentId: mongoose.Schema.Types.ObjectId,
      bookingId: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

// Auto-delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Notification = mongoose.model('Notification', notificationSchema);

// Export all models
export default Notification;
