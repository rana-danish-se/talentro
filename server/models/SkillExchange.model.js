import mongoose from 'mongoose';
const skillExchangeSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillProvided: {
    type: String,
    required: [true, 'Skill provided is required'],
    trim: true
  },
  skillReceived: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  providerReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  receiverReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
});

// Indexes
skillExchangeSchema.index({ providerId: 1, completedAt: -1 });
skillExchangeSchema.index({ receiverId: 1, completedAt: -1 });

export const SkillExchange = mongoose.model('SkillExchange', skillExchangeSchema);