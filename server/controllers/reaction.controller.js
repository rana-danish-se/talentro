import Post from "../models/Post.model.js";
import { Reaction } from "../models/Reaction.model.js";

// ============================================
// React to a post (Like, Love, etc.)
// ============================================
export const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body; 
    const userId = req.user.id;

    const validReactions = [
      "like",
      "love",
      "celebrate",
      "support",
      "insightful",
      "funny",
    ];
    if (!validReactions.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type.",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Check if user already reacted
    const existingReaction = await Reaction.findOne({ postId, userId });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Toggle off if same reaction
        await Reaction.findByIdAndDelete(existingReaction._id);
        post.decrementReaction(type);
        post.likesCount = Math.max(0, post.likesCount - 1); // Simplified total count
      } else {
        // Change reaction
        post.decrementReaction(existingReaction.type);
        post.incrementReaction(type);
        existingReaction.type = type;
        await existingReaction.save();
        // Total count stays same
      }
    } else {
      // New reaction
      await Reaction.create({ postId, userId, type });
      post.incrementReaction(type);
      post.likesCount++;
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Reaction updated.",
      data: {
        reactionsCount: post.reactionsCount,
        likesCount: post.likesCount,
      },
    });
  } catch (error) {
    console.error("Reaction error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing reaction",
      error: error.message,
    });
  }
};
