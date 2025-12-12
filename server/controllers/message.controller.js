import { Message } from "../models/Message.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { Notification } from "../models/Notification.model.js";
import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";

// Helper to Attach Profile Data
const attachProfileProfiles = async (messages) => {
  const userIds = new Set();
  messages.forEach((msg) => {
    if (msg.sender)
      userIds.add(msg.sender._id?.toString() || msg.sender.toString());
    if (msg.conversation && msg.conversation.participants) {
      msg.conversation.participants.forEach((p) =>
        userIds.add(p._id?.toString() || p.toString())
      );
    }
  });

  const profiles = await Profile.find({ userId: { $in: Array.from(userIds) } });
  const profileMap = new Map();
  profiles.forEach((p) => {
    profileMap.set(p.userId.toString(), p);
  });

  return messages.map((msg) => {
    const msgObj = msg.toObject();

    // Enhance Sender
    const senderId = msgObj.sender._id?.toString() || msgObj.sender.toString();
    if (profileMap.has(senderId)) {
      const p = profileMap.get(senderId);
      msgObj.sender = {
        ...msgObj.sender,
        firstName: p.firstName,
        lastName: p.lastName,
        profileImage: p.profileImage,
        username: msg.sender.slug, // Ensure we keep slug if populated
      };
    }

    // Enhance Conversation Participants
    if (msgObj.conversation && msgObj.conversation.participants) {
      msgObj.conversation.participants = msgObj.conversation.participants.map(
        (part) => {
          const pId = part._id?.toString() || part.toString();
          if (profileMap.has(pId)) {
            const p = profileMap.get(pId);
            return {
              ...part,
              firstName: p.firstName,
              lastName: p.lastName,
              profileImage: p.profileImage,
              username: part.slug,
            };
          }
          return part;
        }
      );
    }
    return msgObj;
  });
};

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, subject } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: "Recipient and content are required",
      });
    }

    // 1. Find or create conversation
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
        isGroup: false,
      });
    }

    // 2. Create message
    const newMessage = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      content: {
        text: content,
      },
    });

    // 3. Update conversation
    conversation.lastMessage = newMessage._id;
    // Update unread count for recipient
    const currentUnread = conversation.unreadCount.get(recipientId) || 0;
    conversation.unreadCount.set(recipientId, currentUnread + 1);
    await conversation.save();

    // 4. Create Notification
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: "message",
      title: "New Message",
      message: `You have a new message`,
      metadata: {
        messageId: newMessage._id,
        conversationId: conversation._id,
      },
      actionData: {
        action: "view_message",
        deepLink: `talentro://messages/${conversation._id}`,
      },
      targetRoute: `/dashboard/messaging`, // or specific conversation
    });

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const getSentMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({ sender: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "email slug")
      .populate("conversation")
      .populate({
        path: "conversation",
        populate: {
          path: "participants",
          select: "email slug",
        },
      });

    const enrichedMessages = await attachProfileProfiles(messages);

    const total = await Message.countDocuments({ sender: userId });

    res.status(200).json({
      success: true,
      data: enrichedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get sent messages error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sent messages",
      error: error.message,
    });
  }
};

export const getReceivedMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Find messages where user is in conversation AND NOT the sender
    // However, finding messages by conversation participants is complex efficiently without joining.
    // Easier approach: Find conversations user is in, then find messages in those conversations where sender != user.
    // OR: If we want strict 'Inbox' style, we look for messages where conversation has user as participant and sender is NOT user.

    // Better Approach for 'Inbox': Find conversations, then get latest messages?
    // User asked for "Emails received". So list of messages received.

    // 1. Find conversations user is part of
    const conversations = await Conversation.find({
      participants: userId,
    }).select("_id");
    const conversationIds = conversations.map((c) => c._id);

    const messages = await Message.find({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "email slug")
      .populate({
        path: "conversation",
        populate: {
          path: "participants",
          select: "email slug",
        },
      });

    const enrichedMessages = await attachProfileProfiles(messages);

    const total = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
    });

    res.status(200).json({
      success: true,
      data: enrichedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get received messages error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching received messages",
      error: error.message,
    });
  }
};
