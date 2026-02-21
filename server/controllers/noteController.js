const Note = require('../models/Note');

// Get user notes
exports.getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content, courseId, courseName, lessonName, tags, color } = req.body;

    const note = new Note({
      userId,
      title,
      content,
      courseId,
      courseName,
      lessonName,
      tags: tags || [],
      color: color || 'yellow'
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, tags, color, highlighted } = req.body;

    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (color) note.color = color;
    if (highlighted !== undefined) note.highlighted = highlighted;

    note.updatedAt = new Date();
    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
