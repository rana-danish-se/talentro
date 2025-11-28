import Profile from '../models/Profile.model.js';
import User from '../models/User.model.js'; // Needed if we want to fetch user details with the profile

// --- UTILITY FUNCTION FOR FINDING OWN PROFILE ---
const findOwnProfile = async (userId) => {
    return await Profile.findOne({ userId });
};

/**
 * @desc Get the profile of the currently logged-in user.
 * @route GET /api/v1/profile/me
 * @access Private (Requires 'protect' middleware)
 */
export const getProfile = async (req, res) => {
    try {
        // req.user.id is set by the 'protect' middleware
        const profile = await findOwnProfile(req.user.id);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found for this user.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Current user profile fetched successfully.',
            data: profile
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

/**
 * @desc Get the profile of another user by their User ID.
 * @route GET /api/v1/profile/:userId
 * @access Public/Private (depending on route definition)
 */
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found.'
            });
        }

        // Optional: Also fetch basic public user info (like email, if allowed)
        const user = await User.findById(userId).select('email accountType');

        res.status(200).json({
            success: true,
            message: 'User profile fetched successfully.',
            data: {
                ...profile.toObject(),
                user: user ? user.toObject() : null
            }
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

/**
 * @desc Update the core profile details (first name, last name, bio, etc.) for the logged-in user.
 * @route PUT /api/v1/profile/update
 * @access Private (Requires 'protect' middleware)
 */
export const updateProfile = async (req, res) => {
    try {
        // UPDATED: Added industry, headline, city, and country to the destructured body
        const { firstName, lastName, bio, location, website, industry, headline, city, country } = req.body;

        const updatedFields = {};
        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;
        if (bio !== undefined) updatedFields.bio = bio; 
        if (location !== undefined) updatedFields.location = location;
        if (website !== undefined) updatedFields.website = website;

        // NEW FIELDS: Added checks for new fields from the user request
        if (industry !== undefined) updatedFields.industry = industry;
        if (headline !== undefined) updatedFields.headline = headline;
        if (city !== undefined) updatedFields.city = city;
        if (country !== undefined) updatedFields.country = country;


        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No update fields provided.'
            });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user.id },
            { $set: updatedFields },
            { new: true, runValidators: true } // Return the new document, run schema validations
        );

        if (!profile) {
             // This case is unlikely if the user is logged in, but we handle it just in case.
             return res.status(404).json({
                success: false,
                message: 'Profile not found to update.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: profile
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

/**
 * @desc Handles adding a profile. (Typically redundant as it's done during registration,
 * but included for completeness or social login flows.)
 * @route POST /api/v1/profile/add
 * @access Private (Requires 'protect' middleware)
 */
export const addProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const userId = req.user.id;

        const existingProfile = await findOwnProfile(userId);
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile already exists. Use the update route instead.'
            });
        }

        const newProfile = await Profile.create({
            userId,
            firstName: firstName || 'New',
            lastName: lastName || 'User'
        });

        res.status(201).json({
            success: true,
            message: 'Profile created successfully.',
            data: newProfile
        });

    } catch (error) {
        console.error('Add profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding profile',
            error: error.message
        });
    }
};


/**
 * @desc Update the user's main profile image (avatar).
 * @route PUT /api/v1/profile/image
 * @access Private (Requires 'protect' middleware)
 */
export const updateProfileImage = async (req, res) => {
    try {
        // We assume the body contains the new image URL after a file upload service has returned it
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the new profile image URL.'
            });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { profileImageUrl: imageUrl } },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile image updated successfully.',
            data: { profileImageUrl: profile.profileImageUrl }
        });

    } catch (error) {
        console.error('Update profile image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile image',
            error: error.message
        });
    }
};

/**
 * @desc Update the user's poster/banner image.
 * @route PUT /api/v1/profile/poster
 * @access Private (Requires 'protect' middleware)
 */
export const updatePosterImage = async (req, res) => {
    try {
        // We assume the body contains the new image URL after a file upload service has returned it
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the new poster image URL.'
            });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { posterImageUrl: imageUrl } },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Poster image updated successfully.',
            data: { posterImageUrl: profile.posterImageUrl }
        });

    } catch (error) {
        console.error('Update poster image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating poster image',
            error: error.message
        });
    }
};