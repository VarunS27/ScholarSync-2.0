const Note = require('../models/Note');
const Subject = require('../models/Subject');
const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

// Multer configuration for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|txt/;
    const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed'));
    }
  }
});

// Validation middleware
const noteValidation = (req, res, next) => {
  const { title, subject } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  if (!subject || subject.trim().length === 0) {
    return res.status(400).json({ message: 'Subject is required' });
  }
  
  next();
};

// Upload note with GridFS
const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, subject, tags } = req.body;

    console.log('📝 Upload request:', { title, subject, tags, fileName: req.file.originalname });

    // Check if subject exists
    const subjectExists = await Subject.findOne({ name: subject });
    if (!subjectExists) {
      return res.status(400).json({ message: 'Invalid subject' });
    }

    // Create GridFS bucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Create upload stream
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        uploaderId: req.user._id,
        originalName: req.file.originalname,
        uploadDate: new Date()
      }
    });

    // Write file buffer to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      try {
        console.log('✅ File uploaded to GridFS:', uploadStream.id);

        // Parse tags
        let parsedTags = [];
        if (tags) {
          if (typeof tags === 'string') {
            parsedTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
          } else if (Array.isArray(tags)) {
            parsedTags = tags;
          }
        }

        // Create note document
        const note = new Note({
          title,
          description: description || '',
          subject,
          tags: parsedTags,
          uploaderId: req.user._id,
          fileId: uploadStream.id.toString(),
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: req.file.mimetype
        });

        await note.save();
        console.log('✅ Note created:', note._id);

        // Populate the note before sending response
        await note.populate('uploaderId', 'name email profilePicture');
        await note.populate('subject');

        res.status(201).json({
          message: 'Note uploaded successfully',
          note
        });
      } catch (error) {
        console.error('❌ Error creating note:', error);
        // Clean up uploaded file if note creation fails
        await bucket.delete(uploadStream.id);
        res.status(500).json({ message: 'Error creating note', error: error.message });
      }
    });

    uploadStream.on('error', (error) => {
      console.error('❌ GridFS upload error:', error);
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    });

  } catch (error) {
    console.error('❌ Upload note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all notes with pagination
const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const subject = req.query.subject || '';

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (subject) {
      query.subject = subject;
    }

    const notes = await Note.find(query)
      .populate('uploaderId', 'name email profilePicture')
      .populate('subject')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalNotes: total
    });
  } catch (error) {
    console.error('❌ Get notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single note with preview URL
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

    // Increment views
    if (incrementView) {
      note.views += 1;
      await note.save();
    }

    // Generate preview URL (GridFS route)
    const backendUrl = process.env.BACKEND_URL || 'https://scholarsync-2-0.onrender.com';
    const previewUrl = `${backendUrl}/api/files/${note.fileId}`;

    console.log('📄 Serving note:', { noteId, fileId: note.fileId, previewUrl });

    res.json({
      note,
      previewUrl
    });
  } catch (error) {
    console.error('❌ Get note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { title, description, subject, tags } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user is the uploader
    if (note.uploaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    // Update fields
    if (title) note.title = title;
    if (description !== undefined) note.description = description;
    if (subject) note.subject = subject;
    if (tags) {
      note.tags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : tags;
    }

    await note.save();
    await note.populate('uploaderId', 'name email profilePicture');
    await note.populate('subject');

    res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    console.error('❌ Update note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete note and file
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user is the uploader or admin
    if (note.uploaderId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Delete file from GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    try {
      await bucket.delete(new mongoose.Types.ObjectId(note.fileId));
      console.log('✅ File deleted from GridFS:', note.fileId);
    } catch (error) {
      console.error('⚠️ Error deleting file from GridFS:', error);
    }

    // Delete note
    await note.deleteOne();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('❌ Delete note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get download URL
const getDownloadUrl = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const backendUrl = process.env.BACKEND_URL || 'https://scholarsync-2-0.onrender.com';
    const downloadUrl = `${backendUrl}/api/files/${note.fileId}/download`;

    res.json({
      downloadUrl,
      filename: note.fileName
    });
  } catch (error) {
    console.error('❌ Get download URL error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's notes
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ uploaderId: req.user._id })
      .populate('subject')
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error('❌ Get my notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
