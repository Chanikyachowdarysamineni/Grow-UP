const AIConversation = require('../models/AIConversation');

// Get user's AI conversations
exports.getAIConversations = async (req, res) => {
  try {
    const conversations = await AIConversation.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

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

// Get single conversation
exports.getConversation = async (req, res) => {
  try {
    const conversation = await AIConversation.findById(req.params.conversationId);

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

// Start new conversation
exports.startConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subject, topic } = req.body;

    const conversation = new AIConversation({
      userId,
      subject,
      topic,
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

// Send message to AI tutor
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userMessage } = req.body;

    let conversation = await AIConversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // TODO: Integrate with actual AI service (OpenAI, Hugging Face, etc.)
    // For now, we'll add a placeholder response
    const aiResponse = `This is a response about ${conversation.subject}. ${userMessage}`;

    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
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

// Get learning suggestions
exports.getLearningsuggestions = async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Implement AI-based learning suggestions based on user progress
    const suggestions = {
      recommendedCourses: [],
      suggestedTopics: [],
      improvementAreas: []
    };

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
