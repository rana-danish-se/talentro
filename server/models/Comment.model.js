import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: 1000,
    trim: true
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
    index: true
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  repliesCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ authorId: 1 });
commentSchema.index({ parentCommentId: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);