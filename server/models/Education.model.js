import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  schoolOrUniversity: {
    type: String,
    required: [true, 'School/University name is required'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  fieldOfStudy: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  grade: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  activities: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes
educationSchema.index({ userId: 1, startDate: -1 });

export const Education = mongoose.model('Education', educationSchema);