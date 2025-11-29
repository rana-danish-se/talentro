import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";
import CommentReaction from "../models/CommentReaction.model.js";
import mongoose from "mongoose";

// ============================================
// Add a comment (or reply)
// ============================================
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required.",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const newComment = await Comment.create({
      postId,
      authorId: userId,
      content,
      parentCommentId: parentCommentId || null,
    });

    // Update post comments count
    post.commentsCount++;
    await post.save();

    // If it's a reply, update parent comment's reply count
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $inc: { repliesCount: 1 },
      });
    }

    await newComment.populate(
      "authorId",
      "firstName lastName profileImage headline"
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: newComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

// ============================================
// Get comments for a post
// ============================================
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default 10 as requested
    const skip = (page - 1) * limit;
    const parentCommentId = req.query.parentCommentId || null;

    // Get comments (top-level or replies)
    const query = { postId, parentCommentId };

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "firstName lastName profileImage headline");

    const total = await Comment.countDocuments(query);

    // Check if current user has liked these comments
    const userId = req.user ? req.user.id : null;
    let commentsWithLikes = comments;

    if (userId) {
      const commentIds = comments.map((c) => c._id);
      const userLikes = await CommentReaction.find({
        commentId: { $in: commentIds },
        userId: userId,
        type: "like",
      });

      const likedCommentIds = new Set(
        userLikes.map((l) => l.commentId.toString())
      );

      commentsWithLikes = comments.map((comment) => ({
        ...comment.toObject(),
        isLiked: likedCommentIds.has(comment._id.toString()),
      }));
    }

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully.",
      data: commentsWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

// ============================================
// Like/Unlike a comment
// ============================================
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    if (
      !commentId ||
      commentId === "undefined" ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    const existingReaction = await CommentReaction.findOne({
      commentId,
      userId,
    });

    if (existingReaction) {
      // Unlike
      await CommentReaction.findByIdAndDelete(existingReaction._id);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      // Like
      await CommentReaction.create({ commentId, userId, type: "like" });
      comment.likesCount++;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: existingReaction ? "Comment unliked." : "Comment liked.",
      data: {
        likesCount: comment.likesCount,
        isLiked: !existingReaction,
      },
    });
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({
      success: false,
      message: "Error liking comment",
      error: error.message,
    });
  }
};
