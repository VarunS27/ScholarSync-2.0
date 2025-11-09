const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addComment,
  getComments,
  deleteComment,
  commentValidation
} = require('../controllers/commentsController');

// Public routes
router.get('/:noteId', getComments);

// Protected routes
router.post('/:noteId', auth, commentValidation, addComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
