import Post from "../models/Post.model.js";
import Comment from "../models/Comment.model.js";
import { Reaction } from "../models/Reaction.model.js";
import cloudinary from "../configs/cloudinary.js";

// Helper to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "talentro/posts",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// ============================================
// Create a new post
// ============================================
export const createPost = async (req, res) => {
  try {
    const { text, visibility, isScheduled, scheduledFor } = req.body;
    const authorId = req.user.id;
    const files = req.files || [];

    // Basic validation
    if (!text && files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post content (text or media) is required.",
      });
    }

    // Process media files
    const media = [];
    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const resourceType = file.mimetype.startsWith("video")
          ? "video"
          : "image";
        const result = await uploadToCloudinary(file.buffer, resourceType);
        return {
          type: resourceType,
          url: result.secure_url,
          duration: result.duration || 0,
        };
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      media.push(...uploadedMedia);
    }

    const newPost = await Post.create({
      authorId,
      content: {
        text: text || "",
        media: media,
      },
      visibility: visibility || "public",
      groupId: null, // Explicitly null for user profile posts
      isScheduled: isScheduled || false,
      scheduledFor: isScheduled ? scheduledFor : null,
      isActive: true,

      // Explicitly initialize counters to zero as requested
      likesCount: 0,
      commentsCount: 0,
      reactionsCount: {
        like: 0,
        love: 0,
        celebrate: 0,
        support: 0,
        insightful: 0,
        funny: 0,
      },
      viewsCount: 0,
      impressions: 0,
      engagementRate: 0,
      reportCount: 0,
      isPinned: false,
      isReported: false,
    });

    // Populate author details for the response
    await newPost.populate(
      "authorId",
      "firstName lastName profileImage headline"
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

// ============================================
// Get posts for a specific user (Profile Feed)
// ============================================
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query to get posts where author is the user and it's not a group post
    const query = {
      authorId: userId,
      groupId: null,
      isActive: true,
      isScheduled: false, // Don't show scheduled posts in feed yet
    };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate("authorId", "firstName lastName profileImage headline");

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "User posts fetched successfully.",
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user posts",
      error: error.message,
    });
  }
};

// ============================================
// Get a single post by ID
// ============================================
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "authorId",
      "firstName lastName profileImage headline"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message,
    });
  }
};

// ============================================
// Update a post
// ============================================
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, visibility } = req.body;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: postId, authorId: userId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you are not authorized to edit it.",
      });
    }

    if (content) post.content = content;
    if (visibility) post.visibility = visibility;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

// ============================================
// Delete a post
// ============================================
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findOneAndDelete({ _id: postId, authorId: userId });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you are not authorized to delete it.",
      });
    }

    // Optionally delete associated comments and reactions
    await Comment.deleteMany({ postId });
    await Reaction.deleteMany({ postId });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};
