import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";

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

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          profile,
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
