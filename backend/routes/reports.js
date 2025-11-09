const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  reportNote,
  getReports,
  resolveReport,
  getNoteReportCount,
  reportValidation
} = require('../controllers/reportsController');

// Protected routes
router.post('/note/:id', auth, reportValidation, reportNote);
router.get('/note/:noteId/count', getNoteReportCount);

// Admin routes
router.get('/', auth, admin, getReports);
router.put('/resolve/:id', auth, admin, resolveReport);

module.exports = router;
