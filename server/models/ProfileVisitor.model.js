import mongoose from 'mongoose';

const profileVisitorSchema = new mongoose.Schema(
  {
    profileUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    visitorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
    },
    source: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
profileVisitorSchema.index({ profileUserId: 1, visitedAt: -1 });

// TTL index - auto-delete after 90 days
profileVisitorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const ProfileVisitor = mongoose.model(
  'ProfileVisitor',
  profileVisitorSchema
);
