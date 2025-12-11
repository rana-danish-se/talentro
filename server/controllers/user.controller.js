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
    const services = await Service.find({ userId: user._id });

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
