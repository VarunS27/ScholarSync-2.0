const Note = require('../models/Note');

// Toggle like
const toggleLike = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    console.log('👍 Like request - User ID:', userId.toString(), 'Note ID:', noteId);

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    console.log('Current likes:', note.likes.map(id => id.toString()));
    
    const likeIndex = note.likes.indexOf(userId);
    const dislikeIndex = note.dislikes.indexOf(userId);

    console.log('Like index:', likeIndex, 'Dislike index:', dislikeIndex);

    // Remove from dislikes if present
    if (dislikeIndex > -1) {
      note.dislikes.splice(dislikeIndex, 1);
    }

    // Toggle like
    if (likeIndex > -1) {
      note.likes.splice(likeIndex, 1);
      console.log('❌ Removed like');
    } else {
      note.likes.push(userId);
      console.log('✅ Added like');
    }

    await note.save();

    console.log('Updated likes:', note.likes.map(id => id.toString()));
    console.log('Total likes count:', note.likes.length);

    res.json({
      message: likeIndex > -1 ? 'Like removed' : 'Note liked',
      likes: note.likes.length,
      dislikes: note.dislikes.length,
      userLiked: likeIndex === -1,
      userDisliked: false
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Toggle dislike
const toggleDislike = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const likeIndex = note.likes.indexOf(userId);
    const dislikeIndex = note.dislikes.indexOf(userId);

    // Remove from likes if present
    if (likeIndex > -1) {
      note.likes.splice(likeIndex, 1);
    }

    // Toggle dislike
    if (dislikeIndex > -1) {
      note.dislikes.splice(dislikeIndex, 1);
    } else {
      note.dislikes.push(userId);
    }

    await note.save();

    res.json({
      message: dislikeIndex > -1 ? 'Dislike removed' : 'Note disliked',
      likes: note.likes.length,
      dislikes: note.dislikes.length,
      userLiked: false,
      userDisliked: dislikeIndex === -1
    });
  } catch (error) {
    console.error('Toggle dislike error:', error);
    res.status(500).json({ message: 'Failed to toggle dislike' });
  }
};

// Get reaction status
const getReactionStatus = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      userLiked: note.likes.includes(userId),
      userDisliked: note.dislikes.includes(userId),
      likes: note.likes.length,
      dislikes: note.dislikes.length
    });
  } catch (error) {
    console.error('Get reaction status error:', error);
    res.status(500).json({ message: 'Failed to fetch reaction status' });
  }
};

module.exports = {
  toggleLike,
  toggleDislike,
  getReactionStatus
};
