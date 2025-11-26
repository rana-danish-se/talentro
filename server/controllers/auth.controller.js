import User from '../models/User.model.js';
import Profile from '../models/Profile.model.js';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/sendEmail.js';

const setCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() +  7* 24 * 60 * 60 * 1000), 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    path: '/'
  };

  res.cookie('token', token, cookieOptions);
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Account already exists.'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      email,
      password,
      verificationToken,
      isVerified: false
    });

    await Profile.create({
      userId: user._id,
      firstName,
      lastName
    });

    await sendVerificationEmail(email, verificationToken, firstName);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    const tokenAge = Date.now() - user.createdAt.getTime();
    const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; 

    if (tokenAge > TOKEN_EXPIRY) {
      await Profile.findOneAndDelete({ userId: user._id });
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({
        success: false,
        message: 'Verification link has expired. Please register again.',
        expired: true
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const jwtToken = generateToken(user._id);
    setCookie(res, jwtToken);

    const profile = await Profile.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      type: 'email-verification',
      data: {
        token: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          accountType: user.accountType,
          isPremium: user.isPremium(),
          isVerified: user.isVerified,
          profile: profile ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            profilePicture: profile.profilePicture
          } : null
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ ALREADY GOOD: Handles unverified users gracefully
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        isVerified: false
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    user.lastActive = new Date();
    await user.save();

    const token = generateToken(user._id);
    
    // ✅ NEW: Set cookie on successful login
    setCookie(res, token);

    const profile = await Profile.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          accountType: user.accountType,
          isPremium: user.isPremium(),
          isVerified: user.isVerified,
          profile: profile ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            profilePicture: profile.profilePicture
          } : null
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        lastActive: new Date()
      });
    }

    // ✅ NEW: Clear cookie on logout
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; 
    await user.save();
    
    const profile = await Profile.findOne({ userId: user._id });

    await sendPasswordResetEmail(
      email, 
      resetToken, 
      profile?.firstName || 'User'
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request',
      error: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
      type: 'password-reset'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const profile = await Profile.findOne({ userId: user._id });

    await sendVerificationEmail(
      email, 
      verificationToken, 
      profile?.firstName || 'User'
    );

    res.status(200).json({
      success: true,
      message: 'Verification email has been sent'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification email',
      error: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          accountType: user.accountType,
          isPremium: user.isPremium(),
          isVerified: user.isVerified,
          isActive: user.isActive,
          premiumExpiresAt: user.premiumExpiresAt,
          profile: profile ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            profilePicture: profile.profilePicture,
            bio: profile.bio
          } : null
        }
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};