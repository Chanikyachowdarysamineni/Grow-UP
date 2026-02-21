const Conversation = require('../models/Conversation');

// Get user conversations
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId
    })
      .populate('participants', 'name avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get conversation messages
exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants', 'name avatar');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Start conversation
exports.startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, recipientId] }
    });

    if (conversation) {
      return res.status(400).json({
        success: false,
        message: 'Conversation already exists'
      });
    }

    conversation = new Conversation({
      participants: [req.userId, recipientId],
      messages: []
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Conversation started successfully',
      conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    let conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Verify user is participant
    if (!conversation.participants.includes(req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message'
      });
    }

    conversation.messages.push({
      senderId: req.userId,
      content,
      timestamp: new Date(),
      isRead: false
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    const updatedConversation = await Conversation.findById(conversationId)
      .populate('participants', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      conversation: updatedConversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const message = conversation.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isRead = true;
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
