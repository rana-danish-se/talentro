import { SavedPost } from "../models/SavedPost.model.js";
import Post from "../models/Post.model.js";
import Profile from "../models/Profile.model.js";
import { Reaction } from "../models/Reaction.model.js";

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
          select: "slug email", // Get slug from User model
        },
      });

    const total = await SavedPost.countDocuments({ userId });

    // Filter out null posts (in case original post was deleted)
    const validSavedPosts = savedPosts.filter((sp) => sp.postId !== null);

    // Get profiles for all authors in these posts
    const authorIds = validSavedPosts.map((sp) => sp.postId.authorId._id);
    const profiles = await Profile.find({ userId: { $in: authorIds } });

    // Get user reactions for these posts
    const postIds = validSavedPosts.map((sp) => sp.postId._id);
    const userReactions = await Reaction.find({
      userId,
      postId: { $in: postIds },
    });

    // Format response to match feed structure
    const formattedPosts = validSavedPosts.map((sp) => {
      const post = sp.postId;
      const authorUser = post.authorId; // This is the User doc
      const authorProfile = profiles.find(
        (p) => p.userId.toString() === authorUser._id.toString()
      );
      const reaction = userReactions.find(
        (r) => r.postId.toString() === post._id.toString()
      );

      return {
        ...post.toObject(),
        author: {
          _id: authorUser._id,
          slug: authorUser.slug,
          fullName: authorProfile
            ? `${authorProfile.firstName} ${authorProfile.lastName}`
            : "Unknown User",
          headline: authorProfile?.headline || "",
          profilePicture: authorProfile?.profileImage || "",
        },
        userReaction: reaction ? reaction.type : null,
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
