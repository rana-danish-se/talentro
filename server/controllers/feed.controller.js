import Post from "../models/Post.model.js";
import Connection from "../models/Connection.model.js";
import Profile from "../models/Profile.model.js";
import { Experience } from "../models/Experience.model.js";
import Comment from "../models/Comment.model.js";

// Helper to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper to format posts with author details
const formatPosts = async (posts) => {
  if (!posts || posts.length === 0) return [];

  const authorIds = [...new Set(posts.map((post) => post.authorId.toString()))];

  // Fetch profiles for authors
  const profiles = await Profile.find({ userId: { $in: authorIds } });
  const profileMap = {};
  profiles.forEach((profile) => {
    profileMap[profile.userId.toString()] = profile;
  });

  return posts.map((post) => {
    const profile = profileMap[post.authorId.toString()];
    const postObj = post.toObject ? post.toObject() : post;

    // Calculate total reactions count
    const reactionsCount = postObj.reactionsCount || {
      like: 0,
      love: 0,
      celebrate: 0,
      support: 0,
      insightful: 0,
      funny: 0,
    };

    return {
      _id: postObj._id,
      author: {
        _id: post.authorId,
        fullName: profile
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : "Unknown User",
        headline: profile?.headline || "",
        profilePicture: profile?.profileImage || "",
      },
      content: postObj.content || {},
      visibility: postObj.visibility || "public",
      likesCount: postObj.likesCount || 0,
      commentsCount: postObj.commentsCount || 0,
      reactionsCount,
      comments: [], // Will be populated separately
      createdAt: postObj.createdAt,
      updatedAt: postObj.updatedAt,
    };
  });
};

// Populate comments for posts
const populateComments = async (formattedPosts) => {
  if (!formattedPosts || formattedPosts.length === 0) return formattedPosts;

  const postIds = formattedPosts.map((p) => p._id);

  // Fetch comments for all posts (limit 2 per post for performance)
  const allComments = await Comment.find({ postId: { $in: postIds } })
    .sort({ createdAt: -1 })
    .populate("authorId", "email");

  // Group comments by postId
  const commentsByPost = {};
  allComments.forEach((comment) => {
    const postId = comment.postId.toString();
    if (!commentsByPost[postId]) {
      commentsByPost[postId] = [];
    }
    if (commentsByPost[postId].length < 2) {
      // Limit to 2 comments per post
      commentsByPost[postId].push(comment);
    }
  });

  // Get all comment author IDs
  const commentAuthorIds = allComments.map((c) => c.authorId._id);
  const commentProfiles = await Profile.find({
    userId: { $in: commentAuthorIds },
  });

  const commentProfileMap = {};
  commentProfiles.forEach((p) => (commentProfileMap[p.userId.toString()] = p));

  // Attach comments to posts
  formattedPosts.forEach((post) => {
    const postComments = commentsByPost[post._id.toString()] || [];
    post.comments = postComments.map((comment) => {
      const profile = commentProfileMap[comment.authorId._id.toString()];
      return {
        _id: comment._id,
        id: comment._id,
        authorId: comment.authorId._id,
        author: {
          fullName: profile
            ? `${profile.firstName} ${profile.lastName}`.trim()
            : "Unknown",
          headline: profile?.headline || "",
          profilePicture: profile?.profileImage || "",
        },
        content: comment.content,
        likesCount: comment.likesCount || 0,
        repliesCount: comment.repliesCount || 0,
        createdAt: comment.createdAt,
      };
    });
  });

  return formattedPosts;
};

export const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get User's Connections
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    const connectionIds = connections.map((c) =>
      c.requester.toString() === userId
        ? c.recipient.toString()
        : c.requester.toString()
    );

    // 2. Get Current User's Profile and Experience
    const userProfile = await Profile.findOne({ userId });
    const userExperience = await Experience.findOne({
      userId,
      isCurrentlyWorking: true,
    });

    const userIndustry = userProfile?.industry;
    const userField = userExperience?.title; // User's field (e.g., "Video Editor")

    // 3. FETCH POSTS IN PRIORITY ORDER

    // GROUP A: Connection Posts (Latest, then shuffled)
    let connectionPosts = await Post.find({
      authorId: { $in: connectionIds },
      visibility: { $in: ["public", "connections"] },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    // Shuffle connection posts so they're not all in chronological order
    connectionPosts = shuffleArray(connectionPosts);

    // GROUP B: Same Field Posts (Public, Not from connections, shuffled)
    let fieldPosts = [];
    let fieldUserIds = [];

    if (userField) {
      // Find users with similar field/title
      const similarExperiences = await Experience.find({
        title: { $regex: new RegExp(userField, "i") },
        userId: { $ne: userId, $nin: connectionIds }, // Exclude self and connections
        isCurrentlyWorking: true,
      }).select("userId");

      fieldUserIds = similarExperiences.map((e) => e.userId.toString());

      if (fieldUserIds.length > 0) {
        fieldPosts = await Post.find({
          authorId: { $in: fieldUserIds },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(30);

        // Shuffle field posts
        fieldPosts = shuffleArray(fieldPosts);
      }
    }

    // GROUP C: Same Industry Posts (Public, Not from connections or field users)
    let industryPosts = [];
    let industryUserIds = [];

    if (userIndustry) {
      const sameIndustryProfiles = await Profile.find({
        industry: userIndustry,
        userId: {
          $ne: userId,
          $nin: [...connectionIds, ...fieldUserIds],
        },
      }).select("userId");

      industryUserIds = sameIndustryProfiles.map((p) => p.userId.toString());

      if (industryUserIds.length > 0) {
        industryPosts = await Post.find({
          authorId: { $in: industryUserIds },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(30);

        // Shuffle industry posts
        industryPosts = shuffleArray(industryPosts);
      }
    }

    // GROUP D: Remaining Public Posts (excluding all above categories)
    const excludedAuthorIds = [
      userId,
      ...connectionIds,
      ...fieldUserIds,
      ...industryUserIds,
    ];

    let remainingPosts = await Post.find({
      authorId: { $nin: excludedAuthorIds },
      visibility: "public",
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(30);

    // GROUP E: Current User's Own Posts (added at the end)
    let userOwnPosts = await Post.find({
      authorId: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // 4. COMBINE ALL POSTS IN ORDER
    let allPosts = [
      ...connectionPosts,
      ...fieldPosts,
      ...industryPosts,
      ...remainingPosts,
      ...userOwnPosts, // User's own posts at the end
    ];

    // 5. REMOVE DUPLICATES (in case of any overlap)
    const uniquePosts = [];
    const seenIds = new Set();

    for (const post of allPosts) {
      const postId = post._id.toString();
      if (!seenIds.has(postId)) {
        seenIds.add(postId);
        uniquePosts.push(post);
      }
    }

    // 6. FORMAT POSTS WITH AUTHOR DETAILS
    let formattedFeed = await formatPosts(uniquePosts);

    // 7. POPULATE COMMENTS
    formattedFeed = await populateComments(formattedFeed);

    // 8. RETURN RESPONSE
    res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      data: formattedFeed,
      meta: {
        totalPosts: formattedFeed.length,
        connectionPosts: connectionPosts.length,
        fieldPosts: fieldPosts.length,
        industryPosts: industryPosts.length,
        remainingPosts: remainingPosts.length,
        userOwnPosts: userOwnPosts.length,
      },
    });
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching feed",
      error: error.message,
    });
  }
};
