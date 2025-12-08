import Contact from "../models/Contact.model.js";
import User from "../models/User.model.js";

// --- UTILITY FUNCTION FOR FINDING OWN CONTACT INFO ---
const findOwnContact = async (userId) => {
  return await Contact.findOne({ userId });
};

/**
 * @desc Get the contact information for the currently logged-in user.
 * @route GET /api/v1/contact/me
 * @access Private (Requires 'protect' middleware)
 */
export const getOwnContactInfo = async (req, res) => {
  try {
    // req.user.id is set by the 'protect' middleware
    const contactInfo = await findOwnContact(req.user.id);

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact information not found for this user. Consider adding it first.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Current user contact information fetched successfully.",
      data: contactInfo,
    });
  } catch (error) {
    console.error("Get own contact info error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user contact information",
      error: error.message,
    });
  }
};

/**
 * @desc Get the contact information of another user by their User ID.
 * @route GET /api/v1/contact/:userId
 * @access Public/Private (Requires 'protect' middleware)
 */
export const getContactInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    const contactInfo = await Contact.findOne({ userId });

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: "User contact information not found.",
      });
    }

    // Optional: Fetch basic public user info if needed
    const user = await User.findById(userId).select("slug email");

    res.status(200).json({
      success: true,
      message: "User contact information fetched successfully.",
      data: {
        ...contactInfo.toObject(),
        user: user ? user.toObject() : null,
      },
    });
  } catch (error) {
    console.error("Get contact info error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user contact information",
      error: error.message,
    });
  }
};

/**
 * @desc Add contact details for the logged-in user.
 * @route POST /api/v1/contact/add
 * @access Private (Requires 'protect' middleware)
 */
export const addContactInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingContact = await findOwnContact(userId);
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: "Contact information already exists. Use the update route instead.",
      });
    }

    // Destructure all possible contact fields from the request body
    const { phone, address, linkedIn, github, twitter, website } = req.body;

    const newContactInfo = await Contact.create({
      userId,
      phone,
      address,
      linkedIn,
      github,
      twitter,
      website,
    });

    res.status(201).json({
      success: true,
      message: "Contact information added successfully.",
      data: newContactInfo,
    });
  } catch (error) {
    console.error("Add contact info error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding contact information",
      error: error.message,
    });
  }
};

/**
 * @desc Update the contact details for the logged-in user.
 * @route PUT /api/v1/contact/update
 * @access Private (Requires 'protect' middleware)
 */
export const updateContactInfo = async (req, res) => {
  try {
    // Destructure all possible contact fields from the request body
    const { phone, address, linkedIn, github, twitter, website } = req.body;

    const updatedFields = {};
    if (phone !== undefined) updatedFields.phone = phone;
    if (address !== undefined) updatedFields.address = address;
    if (linkedIn !== undefined) updatedFields.linkedIn = linkedIn;
    if (github !== undefined) updatedFields.github = github;
    if (twitter !== undefined) updatedFields.twitter = twitter;
    if (website !== undefined) updatedFields.website = website;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided.",
      });
    }

    const contactInfo = await Contact.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!contactInfo) {
      // If contact info doesn't exist, we might want to create it instead of updating
      // For simplicity, we assume they should use the /add route first, or we return 404
      return res.status(404).json({
        success: false,
        message: "Contact information not found to update. Please add it first.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully.",
      data: contactInfo,
    });
  } catch (error) {
    console.error("Update contact info error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating contact information",
      error: error.message,
    });
  }
};