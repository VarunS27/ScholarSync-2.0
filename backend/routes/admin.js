const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getStats,
  getUsers,
  toggleBanUser,
  getReportedNotes,
  deleteUser
} = require('../controllers/adminController');

// All routes require auth and admin
router.use(auth, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/ban/:userId', toggleBanUser);
router.delete('/user/:userId', deleteUser);
router.get('/reported', getReportedNotes);

module.exports = router;
