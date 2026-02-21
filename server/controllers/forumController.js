const ForumThread = require('../models/ForumThread');

// Get forum threads
exports.getForumThreads = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) filter.category = category;

    const threads = await ForumThread.find(filter)
      .populate('createdBy', 'name avatar')
      .populate('replies.userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      threads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single thread
exports.getThread = async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.threadId)
      .populate('createdBy', 'name avatar')
      .populate('replies.userId', 'name avatar');

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    res.status(200).json({
      success: true,
      thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create thread
exports.createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const thread = new ForumThread({
      title,
      content,
      category,
      tags: tags || [],
      createdBy: req.userId,
      replies: []
    });

    await thread.save();

    res.status(201).json({
      success: true,
      message: 'Thread created successfully',
      thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add reply to thread
exports.addReply = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;

    let thread = await ForumThread.findById(threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    thread.replies.push({
      userId: req.userId,
      content,
      createdAt: new Date(),
      upvotes: 0,
      isSolution: false
    });

    await thread.save();

    const updatedThread = await ForumThread.findById(threadId)
      .populate('replies.userId', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      thread: updatedThread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Upvote reply
exports.upvoteReply = async (req, res) => {
  try {
    const { threadId, replyId } = req.params;

    const thread = await ForumThread.findById(threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    const reply = thread.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    reply.upvotes += 1;
    await thread.save();

    res.status(200).json({
      success: true,
      message: 'Reply upvoted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark reply as solution
exports.markAsSolution = async (req, res) => {
  try {
    const { threadId, replyId } = req.params;

    const thread = await ForumThread.findById(threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: 'Thread not found'
      });
    }

    // Verify thread creator
    if (thread.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only thread creator can mark solution'
      });
    }

    const reply = thread.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }

    reply.isSolution = true;
    thread.isSolved = true;
    await thread.save();

    res.status(200).json({
      success: true,
      message: 'Reply marked as solution'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
