const Bookmark = require('../models/Bookmark');

// Get user bookmarks
exports.getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create bookmark
exports.createBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { resourceType, resourceId, resourceTitle, category } = req.body;

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      userId,
      resourceId,
      resourceType
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Bookmark already exists'
      });
    }

    const bookmark = new Bookmark({
      userId,
      resourceType,
      resourceId,
      resourceTitle,
      category
    });

    await bookmark.save();

    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete bookmark
exports.deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;

    const bookmark = await Bookmark.findByIdAndDelete(bookmarkId);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
