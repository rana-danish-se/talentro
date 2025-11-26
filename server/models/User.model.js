import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    // Authentication
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    // Account Type & Status
    accountType: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },

    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Verification & Password Reset
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    // Activity Tracking
    lastActive: {
      type: Date,
      default: Date.now,
    },

    // Daily Limits for Free Users
    dailyConnectionRequestsSent: {
      type: Number,
      default: 0,
    },
    dailyConnectionRequestsLimit: {
      type: Number,
      default: 10,
    },
    lastConnectionRequestReset: {
      type: Date,
      default: Date.now,
    },
    dailyConnectionMessagesSent: {
      type: Number,
      default: 0,
    },
    dailyConnectionMessagesLimit: {
      type: Number,
      default: 2,
    },
    lastConnectionMessageReset: {
      type: Date,
      default: Date.now,
    },

    profileViewsCheckedThisWeek: {
      type: Number,
      default: 0,
    },
    profileViewsLimit: {
      type: Number,
      default: 3,
    },
    lastProfileViewReset: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isVerified: 1, createdAt: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre('save', async function () {
  if (this.isNew && !this.isVerified && this.verificationToken) {
    // Set expiry to 24 hours from creation
    this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is premium
userSchema.methods.isPremium = function () {
  if (this.accountType === 'free') return false;
  if (!this.premiumExpiresAt) return true;
  return this.premiumExpiresAt > new Date();
};

// Method to reset connection request limit
userSchema.methods.resetConnectionRequestLimit = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastReset = new Date(this.lastConnectionRequestReset);
  lastReset.setHours(0, 0, 0, 0);

  if (today > lastReset) {
    this.dailyConnectionRequestsSent = 0;
    this.lastConnectionRequestReset = new Date();
  }
};

// ✅ NEW: Check if verification token is expired
userSchema.methods.isVerificationExpired = function () {
  if (!this.verificationTokenExpiry) return false;
  return new Date() > this.verificationTokenExpiry;
};

// Method to reset connection message limit
userSchema.methods.resetConnectionMessageLimit = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastReset = new Date(this.lastConnectionMessageReset);
  lastReset.setHours(0, 0, 0, 0);

  if (today > lastReset) {
    this.dailyConnectionMessagesSent = 0;
    this.lastConnectionMessageReset = new Date();
  }
};

// Method to check if can send connection request
userSchema.methods.canSendConnectionRequest = function () {
  if (this.isPremium()) return true;
  this.resetConnectionRequestLimit();
  return this.dailyConnectionRequestsSent < this.dailyConnectionRequestsLimit;
};

// Method to check if can send connection message
userSchema.methods.canSendConnectionMessage = function () {
  if (this.isPremium()) return true;
  this.resetConnectionMessageLimit();
  return this.dailyConnectionMessagesSent < this.dailyConnectionMessagesLimit;
};

// Method to reset profile view limit (weekly)
userSchema.methods.resetProfileViewLimit = function () {
  const today = new Date();
  const lastReset = new Date(this.lastProfileViewReset);
  const daysSinceReset = Math.floor(
    (today - lastReset) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceReset >= 7) {
    this.profileViewsCheckedThisWeek = 0;
    this.lastProfileViewReset = new Date();
  }
};

// Method to check if can view profile visitors
userSchema.methods.canViewProfileVisitors = function () {
  if (this.isPremium()) return true;
  this.resetProfileViewLimit();
  return this.profileViewsCheckedThisWeek < this.profileViewsLimit;
};
const User = mongoose.model('User', userSchema);
export default User;
