import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email to access this resource'
      });
    }
    req.user = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
      isPremium: user.isPremium()
    };
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

export const isPremium = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user.isPremium()) {
      return res.status(403).json({
        success: false,
        message: 'This feature is only available for premium users',
        requiresPremium: true
      });
    }
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking premium status',
      error: error.message
    });
  }
};