import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: 2000
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String
  },
  gallery: [{
    type: String
  }],
  duration: {
    type: Number,
    min: 0
  },
  requirements: {
    type: String,
    maxlength: 1000
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  totalBookings: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

serviceSchema.index({ userId: 1, createdAt: -1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ tags: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;