import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const joinRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    maxlength: 500,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { _id: true });

const ruleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  }
}, { _id: true });

const groupSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: 100,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Group description is required'],
    trim: true,
    maxlength: 2000
  },
  
  // Images
  logo: {
    type: String,
    default: 'default-group-logo.png'
  },
  posterImage: {
    type: String,
    default: null
  },
  
  // Categories
  industries: [{
    type: String,
    trim: true
  }],
  
  // Privacy & Access
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  
  // Rules
  rules: [ruleSchema],
  
  // Creator & Admins
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Members
  members: [memberSchema],
  
  // Join Requests (for private groups)
  joinRequests: [joinRequestSchema],
  
  // Banned Users
  bannedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      maxlength: 500
    },
    bannedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Settings
  settings: {
    allowMemberPosts: {
      type: Boolean,
      default: true
    },
    requirePostApproval: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    showMemberList: {
      type: Boolean,
      default: true
    }
  },
  
  // Statistics
  stats: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalMembers: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
groupSchema.index({ name: 1 });
groupSchema.index({ privacy: 1 });
groupSchema.index({ industries: 1 });
groupSchema.index({ creator: 1 });
groupSchema.index({ 'members.user': 1 });

// Validation: Maximum 3 industries
groupSchema.pre('validate', function(next) {
  if (this.industries && this.industries.length > 3) {
    next(new Error('Maximum 3 industries allowed'));
  } else {
    next();
  }
});

// Virtual for admin count
groupSchema.virtual('adminCount').get(function() {
  return this.members.filter(m => m.role === 'admin').length;
});

// Virtual for pending requests count
groupSchema.virtual('pendingRequestsCount').get(function() {
  return this.joinRequests.filter(r => r.status === 'pending').length;
});

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString());
};

// Method to check if user is admin
groupSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member && member.role === 'admin';
};

// Method to check if user is moderator or admin
groupSchema.methods.isModerator = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member && (member.role === 'admin' || member.role === 'moderator');
};

// Method to check if user is banned
groupSchema.methods.isBanned = function(userId) {
  return this.bannedUsers.some(b => b.user.toString() === userId.toString());
};

// Method to get member role
groupSchema.methods.getMemberRole = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  return member ? member.role : null;
};

// Method to add member
groupSchema.methods.addMember = async function(userId, role = 'member') {
  if (this.isMember(userId)) {
    throw new Error('User is already a member');
  }
  
  if (this.isBanned(userId)) {
    throw new Error('User is banned from this group');
  }
  
  this.members.push({ user: userId, role });
  this.stats.totalMembers = this.members.length;
  return await this.save();
};

// Method to remove member
groupSchema.methods.removeMember = async function(userId) {
  const initialLength = this.members.length;
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  
  if (this.members.length < initialLength) {
    this.stats.totalMembers = this.members.length;
    return await this.save();
  }
  
  throw new Error('User is not a member');
};

// Method to update member role
groupSchema.methods.updateMemberRole = async function(userId, newRole) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  
  if (!member) {
    throw new Error('User is not a member');
  }
  
  member.role = newRole;
  return await this.save();
};

// Method to ban user
groupSchema.methods.banUser = async function(userId, bannedBy, reason) {
  if (this.isBanned(userId)) {
    throw new Error('User is already banned');
  }
  
  // Remove from members if present
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  
  // Add to banned list
  this.bannedUsers.push({
    user: userId,
    bannedBy,
    reason
  });
  
  this.stats.totalMembers = this.members.length;
  return await this.save();
};

// Method to process join request
groupSchema.methods.processJoinRequest = async function(requestId, status, processedBy) {
  const request = this.joinRequests.id(requestId);
  
  if (!request) {
    throw new Error('Join request not found');
  }
  
  if (request.status !== 'pending') {
    throw new Error('Join request already processed');
  }
  
  request.status = status;
  request.processedAt = new Date();
  request.processedBy = processedBy;
  
  // If approved, add user as member
  if (status === 'approved') {
    await this.addMember(request.user);
  }
  
  return await this.save();
};

const Group = mongoose.model('Group', groupSchema);

export default Group;