import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Content
  content: {
    text: {
      type: String,
      maxlength: 3000,
      trim: true
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      thumbnail: {
        type: String
      },
      duration: {
        type: Number
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      }
    }]
  },
  
  // Post Type & Context
  postType: {
    type: String,
    enum: ['regular', 'skill-exchange', 'service-offer', 'achievement'],
    default: 'regular',
    index: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'connections', 'group'],
    default: 'public',
    index: true
  },
  
  // Engagement Counts (Denormalized for Performance)
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  commentsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reactionsCount: {
    like: { type: Number, default: 0, min: 0 },
    love: { type: Number, default: 0, min: 0 },
    celebrate: { type: Number, default: 0, min: 0 },
    support: { type: Number, default: 0, min: 0 },
    insightful: { type: Number, default: 0, min: 0 },
    funny: { type: Number, default: 0, min: 0 }
  },
  
  // Moderation
  isPinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Analytics (Premium Feature)
  viewsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  impressions: {
    type: Number,
    default: 0,
    min: 0
  },
  engagementRate: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Scheduling (Premium Feature)
  isScheduled: {
    type: Boolean,
    default: false,
    index: true
  },
  scheduledFor: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ groupId: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ isScheduled: 1, scheduledFor: 1 });

// Virtual for total engagement
postSchema.virtual('totalEngagement').get(function() {
  return this.likesCount + this.commentsCount;
});

// Method to increment reaction count
postSchema.methods.incrementReaction = function(reactionType) {
  if (this.reactionsCount.hasOwnProperty(reactionType)) {
    this.reactionsCount[reactionType]++;
    this.markModified('reactionsCount');
  }
};

// Method to decrement reaction count
postSchema.methods.decrementReaction = function(reactionType) {
  if (this.reactionsCount.hasOwnProperty(reactionType) && this.reactionsCount[reactionType] > 0) {
    this.reactionsCount[reactionType]--;
    this.markModified('reactionsCount');
  }
};

const Post = mongoose.model('Post', postSchema);

export default Post;