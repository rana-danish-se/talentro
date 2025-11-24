import mongoose from 'mongoose';
// ============================================
// Conversation.model.js
// ============================================

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    trim: true
  },
  groupImage: {
    type: String
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isArchived: {
    type: Map,
    of: Boolean,
    default: {}
  },
  isMuted: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Method to get other participant in 1-on-1 conversation
conversationSchema.methods.getOtherParticipant = function(userId) {
  if (this.isGroup) return null;
  return this.participants.find(p => p.toString() !== userId.toString());
};

export const Conversation = mongoose.model('Conversation', conversationSchema);