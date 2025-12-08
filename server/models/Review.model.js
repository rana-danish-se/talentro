import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['as-teacher', 'as-learner'],
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  aspects: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    skillQuality: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  response: {
    type: String,
    maxlength: 500,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ revieweeId: 1, isPublic: 1 });
reviewSchema.index({ rating: 1 });

// Method to add response
reviewSchema.methods.addResponse = async function(responseText) {
  this.response = responseText;
  this.respondedAt = new Date();
  return await this.save();
};

// Static method to calculate average rating for a user
reviewSchema.statics.getAverageRating = async function(userId, type) {
  const result = await this.aggregate([
    {
      $match: {
        revieweeId: new mongoose.Types.ObjectId(userId),
        type: type,
        isPublic: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

export const Review = mongoose.model('Review', reviewSchema);
