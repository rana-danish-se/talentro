import mongoose from 'mongoose';
const premiumSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'suspended'],
    default: 'active',
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank-transfer'],
    required: true
  },
  subscriptionId: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    maxlength: 500,
    trim: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
premiumSubscriptionSchema.index({ status: 1 });
premiumSubscriptionSchema.index({ endDate: 1 });
premiumSubscriptionSchema.index({ nextBillingDate: 1 });

export const PremiumSubscription = mongoose.model('PremiumSubscription', premiumSubscriptionSchema);
