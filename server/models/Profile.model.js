import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 50
  },
  headline: {
    type: String,
    trim: true,
    maxlength: 120
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  posterImage: {
    type: String,
    default: null
  },
  industry: {
    type: String,
    trim: true,
    index: true
  },
  about: {
    type: String,
    maxlength: 10000
  },
  location: {
    country: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      trim: true
    }
  },
  
  // Contact Information
  contactInfo: {
    primaryEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    phoneType:{
      type:String,
      default:'Mobile'
    },
    websites: [{
      url: {
        type: String,
        trim: true
      },
      type: {
        type: String,
        default: 'personal'
      }
    }]
  },
  
  // Settings
  settings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public'
    },
    showActivityStatus: {
      type: Boolean,
      default: true
    },
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    }
  },  
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
profileSchema.index({ userId: 1 });
profileSchema.index({ 'location.country': 1, 'location.city': 1 });
profileSchema.index({ industry: 1 });

// Virtual for full name
profileSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;