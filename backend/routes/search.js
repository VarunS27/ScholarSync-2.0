const express = require('express');
const router = express.Router();
const {
  searchNotes,
  getSuggestions
} = require('../controllers/searchController');

// Public routes
router.get('/', searchNotes);
router.get('/suggest', getSuggestions);

module.exports = router;
