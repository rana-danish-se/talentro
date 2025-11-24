import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    default: 'full-time'
  },
  location: {
    type: String,
    trim: true
  },
  locationType: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  isCurrentlyWorking: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: 2000
  },
  skills: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
experienceSchema.index({ userId: 1, startDate: -1 });
experienceSchema.index({ isCurrentlyWorking: 1 });

export const Experience = mongoose.model('Experience', experienceSchema);