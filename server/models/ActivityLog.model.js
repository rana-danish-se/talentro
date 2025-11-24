import mongoose from 'mongoose';
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  activityType: {
    type: String,
    enum: [
      'login',
      'profile_view',
      'profile_update',
      'post_created',
      'post_viewed',
      'connection_made',
      'group_joined',
      'skill_exchange_completed',
      'message_sent'
    ],
    required: true,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet']
  }
}, {
  timestamps: true
});

// Indexes
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ activityType: 1 });

// TTL index - auto-delete after 6 months
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
