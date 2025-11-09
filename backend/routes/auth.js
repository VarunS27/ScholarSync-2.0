const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  getMe,
  deleteAccount,
  registerValidation,
  loginValidation
} = require('../controllers/authController');

// Public routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/google', authLimiter, googleLogin); // Google OAuth route
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.delete('/account', auth, deleteAccount);

module.exports = router;
