import mongoose from 'mongoose';
const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['offering', 'seeking'],
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  proficiencyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  
  // For Offering Skills
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    }
  }],
  sessionType: [{
    type: String,
    enum: ['online', 'in-person']
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
skillSchema.index({ userId: 1, type: 1 });
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });

export const Skill = mongoose.model('Skill', skillSchema);