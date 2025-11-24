import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  scheduledFor: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    index: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 15
  },
  sessionType: {
    type: String,
    enum: ['online', 'in-person'],
    required: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rescheduled', 'no-show'],
    default: 'pending',
    index: true
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  teacherNotes: {
    type: String,
    maxlength: 1000
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    maxlength: 500
  },
  cancelledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  confirmedAt: {
    type: Date
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ learnerId: 1, status: 1 });
bookingSchema.index({ teacherId: 1, status: 1 });
bookingSchema.index({ scheduledFor: 1 });
bookingSchema.index({ status: 1, scheduledFor: 1 });

// Method to confirm booking
bookingSchema.methods.confirm = async function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  return await this.save();
};

// Method to complete booking
bookingSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return await this.save();
};

// Method to cancel booking
bookingSchema.methods.cancel = async function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return await this.save();
};

// Method to reschedule booking
bookingSchema.methods.reschedule = async function(newDate) {
  this.status = 'rescheduled';
  this.scheduledFor = newDate;
  return await this.save();
};

export const Booking = mongoose.model('Booking', bookingSchema);