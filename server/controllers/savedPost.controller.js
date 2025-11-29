import { SavedPost } from "../models/SavedPost.model.js";
import Post from "../models/Post.model.js";

// ============================================
// Toggle Save Post (Save/Unsave)
// ============================================
export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Check if already saved
    const existingSavedPost = await SavedPost.findOne({ userId, postId });

    if (existingSavedPost) {
      // Unsave
      await SavedPost.findByIdAndDelete(existingSavedPost._id);
      return res.status(200).json({
        success: true,
        message: "Post unsaved successfully.",
        isSaved: false,
      });
    } else {
      // Save
      await SavedPost.create({ userId, postId });
      return res.status(201).json({
        success: true,
        message: "Post saved successfully.",
        isSaved: true,
      });
    }
  } catch (error) {
    console.error("Toggle save post error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling save post",
      error: error.message,
    });
  }
};

// ============================================
// Get Saved Posts
// ============================================
export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const savedPosts = await SavedPost.find({ userId })
      .sort({ savedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "postId",
        populate: {
          path: "authorId",
          select: "firstName lastName profileImage headline",
        },
      });

    const total = await SavedPost.countDocuments({ userId });

    // Filter out null posts (in case original post was deleted)
    const validSavedPosts = savedPosts.filter((sp) => sp.postId !== null);

    // Format response to match feed structure if needed, or just return saved post objects
    // Returning the populated post data directly might be easier for the frontend to reuse PostCard
    const formattedPosts = validSavedPosts.map((sp) => {
      const post = sp.postId;
      return {
        ...post.toObject(),
        savedAt: sp.savedAt,
        savedPostId: sp._id,
      };
    });

    res.status(200).json({
      success: true,
      message: "Saved posts fetched successfully.",
      data: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get saved posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching saved posts",
      error: error.message,
    });
  }
};

// ============================================
// Check if Post is Saved
// ============================================
export const checkIsSaved = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const isSaved = await SavedPost.exists({ userId, postId });

    res.status(200).json({
      success: true,
      isSaved: !!isSaved,
    });
  } catch (error) {
    console.error("Check is saved error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking saved status",
      error: error.message,
    });
  }
};
