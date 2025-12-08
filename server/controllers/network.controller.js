import Connection from "../models/Connection.model.js";
import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import { Skill } from "../models/Skill.model.js";
import mongoose from "mongoose";

// Send a connection invitation
export const sendInvitation = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    if (senderId.toString() === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send an invitation to yourself" });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: senderId, recipient: recipientId },
        { requester: recipientId, recipient: senderId },
      ],
    });

    if (existingConnection) {
      if (existingConnection.status === "pending") {
        return res
          .status(400)
          .json({ message: "Connection request already pending" });
      }
      if (existingConnection.status === "accepted") {
        return res.status(400).json({ message: "You are already connected" });
      }
      // If rejected, we might allow resending or not. Usually not immediately.
      // For now, let's assume we can't resend if rejected/blocked without specific logic.
      return res
        .status(400)
        .json({ message: "Connection request was previously rejected" });
    }

    // Check daily limit for free users
    const sender = await User.findById(senderId);
    if (!sender.canSendConnectionRequest()) {
      return res.status(403).json({
        message:
          "Daily connection request limit reached. Upgrade to Premium for unlimited requests.",
      });
    }

    // Create connection request
    const newConnection = new Connection({
      requester: senderId,
      recipient: recipientId,
      status: "pending",
    });

    await newConnection.save();

    // Increment daily count for free users
    if (sender.accountType === "free") {
      sender.dailyConnectionRequestsSent += 1;
      await sender.save();
    }

    res.status(201).json({
      message: "Invitation sent successfully",
      connection: newConnection,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept a connection invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.user.id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this request" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: `Connection request is already ${connection.status}`,
      });
    }

    connection.status = "accepted";
    await connection.save();

    res.status(200).json({ message: "Invitation accepted", connection });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Decline a connection invitation
export const declineInvitation = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.user.id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to decline this request" });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: `Connection request is already ${connection.status}`,
      });
    }

    // Option 1: Delete the request
    // await Connection.findByIdAndDelete(connectionId);

    // Option 2: Mark as rejected
    connection.status = "rejected";
    await connection.save();

    res.status(200).json({ message: "Invitation declined", connection });
  } catch (error) {
    console.error("Error declining invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get received invitations
export const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.id;

    const invitations = await Connection.find({
      recipient: userId,
      status: "pending",
    })
      .populate({
        path: "requester",
        select: "accountType slug", 
      })
      .sort({ createdAt: -1 });

    const formattedInvitations = [];

    for (const invite of invitations) {
      const senderProfile = await Profile.findOne({
        userId: invite.requester._id,
      });
      const myConnections = await Connection.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: "accepted",
      });
      const myConnectionIds = myConnections.map((c) =>
        c.requester.toString() === userId.toString()
          ? c.recipient.toString()
          : c.requester.toString()
      );

      const mutualCount = await Connection.countDocuments({
        $and: [
          { status: "accepted" },
          {
            $or: [
              {
                requester: invite.requester._id,
                recipient: { $in: myConnectionIds },
              },
              {
                recipient: invite.requester._id,
                requester: { $in: myConnectionIds },
              },
            ],
          },
        ],
      });

      formattedInvitations.push({
        _id: invite._id,
        sender: {
          _id: invite.requester._id,
          slug: invite.requester.slug,
          fullName:
            senderProfile?.fullName ||
            `${senderProfile?.firstName || ""} ${
              senderProfile?.lastName || ""
            }`.trim() ||
            "Unknown",
          headline: senderProfile?.headline || "",
          profilePicture: senderProfile?.profileImage || "",
        },
        mutualConnections: mutualCount,
        createdAt: invite.createdAt,
      });
    }

    res.status(200).json(formattedInvitations);
  } catch (error) {
    console.error("Error getting invitations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get total connections count
export const getTotalConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Connection.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "accepted",
    });

    res.status(200).json({ totalConnections: count });
  } catch (error) {
    console.error("Error getting total connections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get suggestions based on Industry -> Skills -> Location -> Mutual -> Others
export const getSuggestionNetwork = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get current user's profile and skills
    const userProfile = await Profile.findOne({ userId });
    const userSkills = await Skill.find({ userId });
    const userSkillNames = userSkills.map((s) => s.name);
    const userIndustry = userProfile?.industry;
    const userCity = userProfile?.location?.city;
    const userCountry = userProfile?.location?.country;

    // 2. Get existing connections (to exclude)
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
    }).select("requester recipient status");

    // Extract all connected user IDs (regardless of status)
    const connectedUserIds = connections.map((c) =>
      c.requester.toString() === userId.toString()
        ? c.recipient.toString()
        : c.requester.toString()
    );

    // Get accepted connections only for mutual connection calculation
    const acceptedConnections = connections
      .filter((c) => c.status === "accepted")
      .map((c) =>
        c.requester.toString() === userId.toString()
          ? c.recipient.toString()
          : c.requester.toString()
      );

    // Exclude current user and all connected users
    const excludeIds = [
      userId,
      ...connectedUserIds.map((id) => new mongoose.Types.ObjectId(id)),
    ];

    // 3. Find all eligible candidates
    const candidates = await User.aggregate([
      {
        $match: {
          _id: { $nin: excludeIds },
          isActive: true,
        },
      },
      // Lookup Profile
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },

      // Lookup Skills
      {
        $lookup: {
          from: "skills",
          localField: "_id",
          foreignField: "userId",
          as: "skills",
        },
      },

      // Calculate matching scores
      {
        $addFields: {
          skillNames: "$skills.name",
          // Industry match
          isSameIndustry: {
            $cond: {
              if: {
                $and: [
                  userIndustry,
                  { $ne: ["$profile.industry", null] },
                  { $eq: ["$profile.industry", userIndustry] },
                ],
              },
              then: 1,
              else: 0,
            },
          },
          // Skill match count
          sharedSkillsCount: {
            $size: {
              $ifNull: [
                {
                  $setIntersection: [
                    { $ifNull: ["$skills.name", []] },
                    userSkillNames,
                  ],
                },
                [],
              ],
            },
          },
          // Location matches
          isSameCity: {
            $cond: {
              if: {
                $and: [
                  userCity,
                  { $ne: ["$profile.location.city", null] },
                  { $eq: ["$profile.location.city", userCity] },
                ],
              },
              then: 1,
              else: 0,
            },
          },
          isSameCountry: {
            $cond: {
              if: {
                $and: [
                  userCountry,
                  { $ne: ["$profile.location.country", null] },
                  { $eq: ["$profile.location.country", userCountry] },
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },

      // Project only needed fields
      {
        $project: {
          _id: 1,
          email: 1,
          slug: 1,
          createdAt: 1,
          profile: 1,
          skillNames: 1,
          isSameIndustry: 1,
          sharedSkillsCount: 1,
          isSameCity: 1,
          isSameCountry: 1,
        },
      },
    ]);

    // 4. Calculate mutual connections for each candidate
    const formattedSuggestions = [];

    for (const user of candidates) {
      // Calculate mutual connections
      const mutualCount = await Connection.countDocuments({
        $and: [
          { status: "accepted" },
          {
            $or: [
              {
                requester: user._id,
                recipient: {
                  $in: acceptedConnections.map(
                    (id) => new mongoose.Types.ObjectId(id)
                  ),
                },
              },
              {
                recipient: user._id,
                requester: {
                  $in: acceptedConnections.map(
                    (id) => new mongoose.Types.ObjectId(id)
                  ),
                },
              },
            ],
          },
        ],
      });

      // Determine primary reason for suggestion
      let reason = "other";
      if (user.isSameIndustry) {
        reason = "industry";
      } else if (user.sharedSkillsCount > 0) {
        reason = "skill";
      } else if (user.isSameCity || user.isSameCountry) {
        reason = "location";
      } else if (mutualCount > 0) {
        reason = "mutual";
      }

      formattedSuggestions.push({
        _id: user._id,
        slug: user.slug,
        fullName:
          user.profile?.firstName && user.profile?.lastName
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : "Unknown User",
        headline: user.profile?.headline || "",
        profilePicture:
          user.profile?.profileImage || "/assets/default-avatar.jpg",
        industry: user.profile?.industry || "",
        location: {
          city: user.profile?.location?.city || "",
          country: user.profile?.location?.country || "",
        },
        mutualConnections: mutualCount,
        sharedSkills: user.sharedSkillsCount,
        reason: reason,
        // Scores for sorting (internal use)
        _scores: {
          industry: user.isSameIndustry,
          skills: user.sharedSkillsCount,
          sameCity: user.isSameCity,
          sameCountry: user.isSameCountry,
          mutual: mutualCount,
        },
      });
    }

    // 5. Sort by priority: Industry > Skills > Location (City > Country) > Mutual > Others
    formattedSuggestions.sort((a, b) => {
      // Priority 1: Same Industry
      if (a._scores.industry !== b._scores.industry) {
        return b._scores.industry - a._scores.industry;
      }

      // Priority 2: Shared Skills (count)
      if (a._scores.skills !== b._scores.skills) {
        return b._scores.skills - a._scores.skills;
      }

      // Priority 3: Same City
      if (a._scores.sameCity !== b._scores.sameCity) {
        return b._scores.sameCity - a._scores.sameCity;
      }

      // Priority 4: Same Country
      if (a._scores.sameCountry !== b._scores.sameCountry) {
        return b._scores.sameCountry - a._scores.sameCountry;
      }

      // Priority 5: Mutual Connections
      if (a._scores.mutual !== b._scores.mutual) {
        return b._scores.mutual - a._scores.mutual;
      }

      // Priority 6: Most recent users
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    // 6. Remove internal scores before sending response
    const finalSuggestions = formattedSuggestions.map(
      ({ _scores, ...user }) => user
    );

    res.status(200).json({
      success: true,
      count: finalSuggestions.length,
      suggestions: finalSuggestions,
    });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
