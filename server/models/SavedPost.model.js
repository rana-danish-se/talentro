import mongoose from 'mongoose';
const savedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  collections: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound unique index
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
savedPostSchema.index({ userId: 1, savedAt: -1 });

export const SavedPost = mongoose.model('SavedPost', savedPostSchema);
