import mongoose from 'mongoose';
const postHashtagSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    hashtagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hashtag',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index
postHashtagSchema.index({ postId: 1, hashtagId: 1 }, { unique: true });

export const PostHashtag = mongoose.model('PostHashtag', postHashtagSchema);
