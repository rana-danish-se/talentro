import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: 2000
  },
  skillsUsed: [{
    type: String,
    trim: true
  }],
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String
    }
  }],
  projectUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ userId: 1, createdAt: -1 });

export const Project = mongoose.model('Project', projectSchema);