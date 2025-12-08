import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    text: {
      type: String,
      trim: true,
      maxlength: 5000
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'video', 'document'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      size: {
        type: Number // in bytes
      }
    }]
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export const Message = mongoose.model('Message', messageSchema);