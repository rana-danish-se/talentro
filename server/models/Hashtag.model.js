import mongoose from 'mongoose';
const hashtagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
hashtagSchema.index({ usageCount: -1 });
hashtagSchema.index({ lastUsedAt: -1 });

export const Hashtag = mongoose.model('Hashtag', hashtagSchema);
