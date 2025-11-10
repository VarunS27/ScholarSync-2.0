const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const User = require('../models/User');
const { uploadToS3, deleteFromS3, getSignedUrlForFile } = require('../utils/s3Uploader');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, PPTX, JPG, JPEG, PNG, and TXT files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter,
});

// Validation rules
const noteValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('allowDownload').optional().isBoolean()
];

// Upload note
const uploadNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request body:', req.body);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const { title, subject, description, tags, allowDownload } = req.body;

    // Upload file to S3
    const { fileKey, fileUrl } = await uploadToS3(req.file);

    // Create note
    const note = new Note({
      title,
      subject,
      description,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      uploaderId: req.user._id,
      allowDownload: allowDownload === 'true' || allowDownload === true,
      fileUrl,
      fileKey,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });

    await note.save();

    const populatedNote = await Note.findById(note._id)
      .populate('uploaderId', 'name email');

    res.status(201).json({
      message: 'Note uploaded successfully',
      note: populatedNote
    });
  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload note' });
  }
};

// Get all notes with filters
const getNotes = async (req, res) => {
  try {
    const { subject, query, sort = 'recent', page = 1, limit = 12 } = req.query;

    const filter = {};
    
    if (subject && subject !== 'all') {
      filter.subject = subject;
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'recent':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'liked':
        sortOption = { likes: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find(filter)
      .populate('uploaderId', 'name email')
      .sort(sortOption)
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
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// Get single note
const getNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const incrementView = req.query.incrementView === 'true';

    const note = await Note.findById(noteId)
      .populate('uploaderId', 'name email profilePicture')
      .populate('subject');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment views if requested and not already viewed
    if (incrementView) {
      note.views += 1;
      await note.save();
    }

    // Generate preview URL from S3 or GridFS
    let previewUrl = null;

    if (note.fileId) {
      // Use backend file route for GridFS
      previewUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/files/${note.fileId}`;
    }

    res.json({
      note,
      previewUrl
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check ownership or admin
    if (note.uploaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    const { title, subject, description, tags, allowDownload } = req.body;

    if (title) note.title = title;
    if (subject) note.subject = subject;
    if (description) note.description = description;
    if (tags) note.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (allowDownload !== undefined) note.allowDownload = allowDownload === 'true' || allowDownload === true;

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate('uploaderId', 'name email');

    res.json({
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check ownership or admin
    if (note.uploaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Delete from S3
    await deleteFromS3(note.fileKey);

    // Delete note
    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};

// Get download URL
const getDownloadUrl = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.allowDownload) {
      return res.status(403).json({ message: 'Download not allowed for this note' });
    }

    // Generate signed URL for download
    const downloadUrl = await getSignedUrlForFile(note.fileKey, 300); // 5 minutes

    res.json({
      downloadUrl,
      filename: note.title
    });
  } catch (error) {
    console.error('Get download URL error:', error);
    res.status(500).json({ message: 'Failed to generate download URL' });
  }
};

// Get user's notes
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ uploaderId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('uploaderId', 'name email');

    res.json({ notes });
  } catch (error) {
    console.error('Get my notes error:', error);
    res.status(500).json({ message: 'Failed to fetch your notes' });
  }
};

module.exports = {
  upload,
  uploadNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getDownloadUrl,
  getMyNotes,
  noteValidation
};
