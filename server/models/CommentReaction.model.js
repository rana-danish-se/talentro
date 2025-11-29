import mongoose from "mongoose";

const commentReactionSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["like"], // Currently only supporting 'like' for comments
      default: "like",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index - one reaction per user per comment
commentReactionSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentReaction = mongoose.model(
  "CommentReaction",
  commentReactionSchema
);
export default CommentReaction;
