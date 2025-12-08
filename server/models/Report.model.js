import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reportedItemType: {
    type: String,
    enum: ['user', 'post', 'comment', 'group', 'message'],
    required: true,
    index: true
  },
  reportedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    enum: [
      'spam',
      'harassment',
      'hate-speech',
      'violence',
      'inappropriate-content',
      'false-information',
      'scam',
      'impersonation',
      'intellectual-property',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'resolved', 'dismissed'],
    default: 'pending',
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  action: {
    type: String,
    enum: ['none', 'warning', 'content-removed', 'user-suspended', 'user-banned']
  },
  notes: {
    type: String,
    maxlength: 1000,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reportedItemType: 1, reportedItemId: 1 });

export const Report = mongoose.model('Report', reportSchema);