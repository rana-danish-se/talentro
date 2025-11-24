// ============================================
// models/Reaction.model.js
// ============================================
import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'celebrate', 'support', 'insightful', 'funny'],
    required: true
  }
}, {
  timestamps: true
});

// Compound unique index - one reaction per user per post
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });
export const Reaction = mongoose.model('Reaction', reactionSchema);