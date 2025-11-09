const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  upload,
  uploadNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getDownloadUrl,
  getMyNotes,
  noteValidation
} = require('../controllers/notesController');

// Public routes
router.get('/', getNotes);
router.get('/:id', getNote);

// Protected routes
router.post('/', auth, uploadLimiter, upload.single('file'), noteValidation, uploadNote);
router.put('/:id', auth, noteValidation, updateNote);
router.delete('/:id', auth, deleteNote);
router.get('/:id/download', auth, getDownloadUrl); // Fixed: moved :id before /download
router.get('/user/my-notes', auth, getMyNotes);

module.exports = router;
