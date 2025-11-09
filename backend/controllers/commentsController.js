const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Note = require('../models/Note');

// Validation rules
const commentValidation = [
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 500 })
];

// Add comment
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { noteId } = req.params;
    const { text } = req.body;

    // Check if note exists
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const comment = new Comment({
      noteId,
      userId: req.user._id,
      text
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Get comments for a note
const getComments = async (req, res) => {
  try {
    const { noteId } = req.params;

    const comments = await Comment.find({ noteId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      comments,
      total: comments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership or admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  commentValidation
};
