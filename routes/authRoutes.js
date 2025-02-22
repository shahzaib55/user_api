const express = require('express');
const { register, login, verifyEmail, verifyOTP } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/forgotPasswordController');
const passport = require('../config/config'); // Fixed import path
const { generateSessionToken } = require('../utils/jwtHandler');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/verifyOtp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/login', // Define this route if needed
    session: false // Disable sessions if using JWT
  }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = generateSessionToken(user._id, user.email);

      // Set cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure only in production
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Redirect or send JSON response
      res.redirect('/dashboard'); // Or res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Optional: Define a login route for failure redirect
router.get('/login', (req, res) => {
  res.status(401).json({ message: 'Authentication failed. Please try again.' });
});

module.exports = router;