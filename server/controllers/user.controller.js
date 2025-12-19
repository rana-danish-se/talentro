import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import Connection from "../models/Connection.model.js";
import { Education } from "../models/Education.model.js";
import { Project } from "../models/Project.model.js";
import { Skill } from "../models/Skill.model.js";
import Service from "../models/Service.model.js";
import { Experience } from "../models/Experience.model.js";

export const getUserBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = await User.findOne({ slug });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const profile = await Profile.findOne({ userId: user._id });

    // Count connections (both as requester and recipient with status 'accepted')
    const connectionCount = await Connection.countDocuments({
      $or: [
        { requester: user._id, status: "accepted" },
        { recipient: user._id, status: "accepted" },
      ],
    });

    // Check connection status with current user
    let connectionStatus = null;
    let connectionId = null;

    const currentUserId = req.user?.id; // May be undefined if not authenticated

    if (currentUserId && currentUserId !== user._id.toString()) {
      const existingConnection = await Connection.findOne({
        $or: [
          { requester: currentUserId, recipient: user._id },
          { requester: user._id, recipient: currentUserId },
        ],
      });

      if (existingConnection) {
        connectionStatus = existingConnection.status; // 'pending', 'accepted', 'rejected'
        connectionId = existingConnection._id;

        // Determine who sent the request
        if (existingConnection.status === "pending") {
          if (existingConnection.requester.toString() === currentUserId) {
            connectionStatus = "pending_sent"; // Current user sent request
          } else {
            connectionStatus = "pending_received"; // Current user received request
          }
        }
      }
    }

    // Fetch user's education records
    const educations = await Education.find({ userId: user._id }).sort({
      startDate: -1,
    });

    // Fetch user's projects
    const projects = await Project.find({ userId: user._id }).sort({
      startDate: -1,
    });

    // Fetch user's skills
    const skills = await Skill.find({ userId: user._id });

    // Fetch user's services
    const services = await Service.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    console.log(`Fetched ${services.length} services for user ${user._id}`);

    // Fetch user's experiences
    const experiences = await Experience.find({ userId: user._id }).sort({
      startDate: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          profile,
          connectionCount,
          connectionStatus,
          connectionId,
          educations,
          projects,
          skills,
          services,
          experiences,
        },
      },
    });
  } catch (error) {
    console.error("Get user by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user?.id;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // 1. Search Profiles for Name matches
    const profiles = await Profile.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    }).populate("userId", "email slug _id");

    // 2. Search Users for Email/Slug matches
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ],
    }).select("email slug _id");

    // 3. Combine and Format
    const userMap = new Map();

    // Process Profile matches
    for (const p of profiles) {
      if (!p.userId) continue; // Should not happen if data integrity is good
      const uId = p.userId._id.toString();
      if (uId === currentUserId) continue; // Exclude self

      userMap.set(uId, {
        _id: p.userId._id,
        firstName: p.firstName,
        lastName: p.lastName,
        username: p.userId.slug, // Assuming slug is used as username
        email: p.userId.email,
        profileImage: p.profileImage,
        headline: p.headline,
      });
    }

    // Process User matches (fetch their profiles if not already in map)
    for (const u of users) {
      const uId = u._id.toString();
      if (uId === currentUserId) continue;
      if (userMap.has(uId)) continue; // Already added via profile match

      const p = await Profile.findOne({ userId: u._id });
      if (p) {
        userMap.set(uId, {
          _id: u._id,
          firstName: p.firstName,
          lastName: p.lastName,
          username: u.slug,
          email: u.email,
          profileImage: p.profileImage,
          headline: p.headline,
        });
      }
    }

    const results = Array.from(userMap.values()).slice(0, 10);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};
