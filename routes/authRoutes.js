const express = require('express');
const { register, login, verifyEmail, verifyOTP } = require('../controllers/authController');
const { forgotPassword, resetPassword  } = require('../controllers/forgotPasswordController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/verifyOtp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports = router;
