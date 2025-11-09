const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  toggleLike,
  toggleDislike,
  getReactionStatus
} = require('../controllers/reactionsController');

// Protected routes
router.post('/like/:noteId', auth, toggleLike);
router.post('/dislike/:noteId', auth, toggleDislike);
router.get('/status/:noteId', auth, getReactionStatus);

module.exports = router;
