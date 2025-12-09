import Post from "../models/Post.model.js";
import Connection from "../models/Connection.model.js";
import Profile from "../models/Profile.model.js";
import { Experience } from "../models/Experience.model.js";
import { Skill } from "../models/Skill.model.js";
import Comment from "../models/Comment.model.js";
import { Reaction } from "../models/Reaction.model.js";

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
const formatPosts = async (posts, currentUserId) => {
  if (!posts || posts.length === 0) return [];

  const authorIds = [...new Set(posts.map((post) => post.authorId.toString()))];
  const postIds = posts.map((post) => post._id);

  // Fetch profiles for authors
  const profiles = await Profile.find({ userId: { $in: authorIds } }).populate(
    "userId",
    "slug"
  );

  // Fetch user reactions for these posts
  let userReactionsMap = {};
  if (currentUserId) {
    const userReactions = await Reaction.find({
      userId: currentUserId,
      postId: { $in: postIds },
    });
    userReactions.forEach((reaction) => {
      userReactionsMap[reaction.postId.toString()] = reaction.type;
    });
  }

  const profileMap = {};
  profiles.forEach((profile) => {
    if (profile.userId) {
      profileMap[profile.userId._id.toString()] = profile;
    }
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
        slug: profile?.userId?.slug || "",
        profilePicture: profile?.profileImage || "",
      },
      content: postObj.content || {},
      visibility: postObj.visibility || "public",
      likesCount: postObj.likesCount || 0,
      commentsCount: postObj.commentsCount || 0,
      reactionsCount,
      userReaction: userReactionsMap[postObj._id.toString()] || null,
      comments: [],
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
  const allComments = await Comment.find({
    postId: { $in: postIds },
    parentCommentId: null, // Only fetch top-level comments
  })
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

    // 1. Get User's Connections (Accepted Only)
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    const connectionIds = connections.map((c) =>
      c.requester.toString() === userId
        ? c.recipient.toString()
        : c.requester.toString()
    );

    // 2. Get Current User's Profile, Skills, and Experience
    const userProfile = await Profile.findOne({ userId });
    const userSkills = await Skill.find({ userId });
    const userExperience = await Experience.findOne({
      userId,
      isCurrentlyWorking: true,
    });

    const userIndustry = userProfile?.industry;
    const userCity = userProfile?.location?.city;
    const userCountry = userProfile?.location?.country;
    const userSkillNames = userSkills.map((s) => s.name);
    const userField = userExperience?.title;

    // Track which users belong to which category
    const categorizedUsers = {
      connections: new Set(connectionIds.map((id) => id.toString())),
      industry: new Set(),
      city: new Set(),
      country: new Set(),
      skills: new Set(),
      field: new Set(),
    };

    // 3. Find users from SAME INDUSTRY
    let industryUserIds = [];
    if (userIndustry) {
      const sameIndustryProfiles = await Profile.find({
        industry: userIndustry,
        userId: { $ne: userId },
      }).select("userId");

      industryUserIds = sameIndustryProfiles.map((p) => p.userId.toString());
      industryUserIds.forEach((id) => categorizedUsers.industry.add(id));
    }

    // 4. Find users from SAME LOCATION (City & Country)
    let locationUserIds = [];
    if (userCity || userCountry) {
      const query = { userId: { $ne: userId } };

      if (userCity && userCountry) {
        query.$or = [
          { "location.city": userCity },
          { "location.country": userCountry },
        ];
      } else if (userCity) {
        query["location.city"] = userCity;
      } else if (userCountry) {
        query["location.country"] = userCountry;
      }

      const sameLocationProfiles = await Profile.find(query).select(
        "userId location"
      );

      sameLocationProfiles.forEach((p) => {
        const id = p.userId.toString();
        locationUserIds.push(id);

        if (p.location?.city === userCity) {
          categorizedUsers.city.add(id);
        }
        if (p.location?.country === userCountry) {
          categorizedUsers.country.add(id);
        }
      });
    }

    // 5. Find users with SAME SKILLS
    let skillUserIds = [];
    if (userSkillNames.length > 0) {
      const similarSkills = await Skill.find({
        name: { $in: userSkillNames },
        userId: { $ne: userId },
      }).select("userId");

      skillUserIds = [
        ...new Set(similarSkills.map((s) => s.userId.toString())),
      ];
      skillUserIds.forEach((id) => categorizedUsers.skills.add(id));
    }

    // 6. Find users from SAME FIELD
    let fieldUserIds = [];
    if (userField) {
      const similarExperiences = await Experience.find({
        title: { $regex: new RegExp(userField, "i") },
        userId: { $ne: userId },
        isCurrentlyWorking: true,
      }).select("userId");

      fieldUserIds = similarExperiences.map((e) => e.userId.toString());
      fieldUserIds.forEach((id) => categorizedUsers.field.add(id));
    }


    // GROUP A: Connection Posts (Public + Connections visibility)
    let connectionPosts = [];
    if (connectionIds.length > 0) {
      connectionPosts = await Post.find({
        authorId: { $in: connectionIds },
        visibility: { $in: ["public", "connections"] },
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      connectionPosts = shuffleArray(connectionPosts);
    }

    // GROUP B: Same Industry Posts (Public only)
    let industryPosts = [];
    if (industryUserIds.length > 0) {
      const industryOnlyUsers = industryUserIds.filter(
        (id) => !categorizedUsers.connections.has(id)
      );

      if (industryOnlyUsers.length > 0) {
        industryPosts = await Post.find({
          authorId: { $in: industryOnlyUsers },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(30);

        industryPosts = shuffleArray(industryPosts);
      }
    }

    // GROUP C: Same Location Posts (City priority, then Country)
    let locationPosts = [];
    if (locationUserIds.length > 0) {
      const locationOnlyUsers = locationUserIds.filter(
        (id) =>
          !categorizedUsers.connections.has(id) &&
          !categorizedUsers.industry.has(id)
      );

      if (locationOnlyUsers.length > 0) {
        // Prioritize city matches over country matches
        const cityUsers = locationOnlyUsers.filter((id) =>
          categorizedUsers.city.has(id)
        );
        const countryUsers = locationOnlyUsers.filter(
          (id) =>
            !categorizedUsers.city.has(id) && categorizedUsers.country.has(id)
        );

        const cityPosts = await Post.find({
          authorId: { $in: cityUsers },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(20);

        const countryPosts = await Post.find({
          authorId: { $in: countryUsers },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(20);

        locationPosts = shuffleArray([...cityPosts, ...countryPosts]);
      }
    }

    // GROUP D: Same Skills Posts
    let skillPosts = [];
    if (skillUserIds.length > 0) {
      const skillOnlyUsers = skillUserIds.filter(
        (id) =>
          !categorizedUsers.connections.has(id) &&
          !categorizedUsers.industry.has(id) &&
          !locationUserIds.includes(id)
      );

      if (skillOnlyUsers.length > 0) {
        skillPosts = await Post.find({
          authorId: { $in: skillOnlyUsers },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(30);

        skillPosts = shuffleArray(skillPosts);
      }
    }

    // GROUP E: Same Field Posts
    let fieldPosts = [];
    if (fieldUserIds.length > 0) {
      const fieldOnlyUsers = fieldUserIds.filter(
        (id) =>
          !categorizedUsers.connections.has(id) &&
          !categorizedUsers.industry.has(id) &&
          !locationUserIds.includes(id) &&
          !categorizedUsers.skills.has(id)
      );

      if (fieldOnlyUsers.length > 0) {
        fieldPosts = await Post.find({
          authorId: { $in: fieldOnlyUsers },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(30);

        fieldPosts = shuffleArray(fieldPosts);
      }
    }

    // GROUP F: Mutual Connections (2nd degree connections)
    let mutualPosts = [];
    if (connectionIds.length > 0) {
      // Find connections of my connections
      const mutualConnections = await Connection.find({
        $or: [
          { requester: { $in: connectionIds }, status: "accepted" },
          { recipient: { $in: connectionIds }, status: "accepted" },
        ],
      });

      const mutualUserIds = [
        ...new Set(
          mutualConnections.map((c) =>
            connectionIds.includes(c.requester.toString())
              ? c.recipient.toString()
              : c.requester.toString()
          )
        ),
      ].filter(
        (id) =>
          id !== userId.toString() &&
          !connectionIds.includes(id) &&
          !industryUserIds.includes(id) &&
          !locationUserIds.includes(id) &&
          !skillUserIds.includes(id) &&
          !fieldUserIds.includes(id)
      );

      if (mutualUserIds.length > 0) {
        mutualPosts = await Post.find({
          authorId: { $in: mutualUserIds },
          visibility: "public",
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(20);

        mutualPosts = shuffleArray(mutualPosts);
      }
    }

    // GROUP G: Remaining Public Posts
    const allCategorizedUsers = [
      userId,
      ...connectionIds,
      ...industryUserIds,
      ...locationUserIds,
      ...skillUserIds,
      ...fieldUserIds,
    ];

    let remainingPosts = await Post.find({
      authorId: { $nin: allCategorizedUsers },
      visibility: "public",
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(30);

    remainingPosts = shuffleArray(remainingPosts);

    // GROUP H: Current User's Own Posts (at the end)
    let userOwnPosts = await Post.find({
      authorId: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // 8. COMBINE ALL POSTS IN PRIORITY ORDER
    let allPosts = [
      ...connectionPosts, // Priority 1: Direct connections
      ...industryPosts, // Priority 2: Same industry
      ...locationPosts, // Priority 3: Same location (city > country)
      ...skillPosts, // Priority 4: Same skills
      ...fieldPosts, // Priority 5: Same field
      ...mutualPosts, // Priority 6: Mutual connections
      ...remainingPosts, // Priority 7: Other public posts
      ...userOwnPosts, // Priority 8: User's own posts
    ];

    // 9. REMOVE DUPLICATES
    const uniquePosts = [];
    const seenIds = new Set();

    for (const post of allPosts) {
      const postId = post._id.toString();
      if (!seenIds.has(postId)) {
        seenIds.add(postId);
        uniquePosts.push(post);
      }
    }

    // 10. FORMAT POSTS WITH AUTHOR DETAILS
    let formattedFeed = await formatPosts(uniquePosts, userId);

    // 11. POPULATE COMMENTS
    formattedFeed = await populateComments(formattedFeed);

    // 12. RETURN RESPONSE
    res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      data: formattedFeed,
      meta: {
        totalPosts: formattedFeed.length,
        breakdown: {
          connectionPosts: connectionPosts.length,
          industryPosts: industryPosts.length,
          locationPosts: locationPosts.length,
          skillPosts: skillPosts.length,
          fieldPosts: fieldPosts.length,
          mutualPosts: mutualPosts.length,
          remainingPosts: remainingPosts.length,
          userOwnPosts: userOwnPosts.length,
        },
        hasConnections: connectionIds.length > 0,
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
