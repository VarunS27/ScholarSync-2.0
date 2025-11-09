const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getSubjects,
  addSubject,
  deleteSubject,
  subjectValidation
} = require('../controllers/subjectsController');

// Public routes
router.get('/', getSubjects);

// Admin routes
router.post('/', auth, admin, subjectValidation, addSubject);
router.delete('/:id', auth, admin, deleteSubject);

module.exports = router;
