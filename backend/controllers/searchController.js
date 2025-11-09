const Note = require('../models/Note');

// Search notes
const searchNotes = async (req, res) => {
  try {
    const { q, subject, page = 1, limit = 12 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ notes: [], pagination: { total: 0, page: 1, pages: 0 } });
    }

    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    };

    if (subject && subject !== 'all') {
      filter.subject = subject;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find(filter)
      .populate('uploaderId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

// Get search suggestions
const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ suggestions: [] });
    }

    // Get top 5 matching notes by title
    const notes = await Note.find({
      title: { $regex: q, $options: 'i' }
    })
    .select('title subject')
    .limit(5)
    .sort({ views: -1 });

    const suggestions = notes.map(note => ({
      id: note._id,
      title: note.title,
      subject: note.subject
    }));

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Failed to get suggestions' });
  }
};

module.exports = {
  searchNotes,
  getSuggestions
};
