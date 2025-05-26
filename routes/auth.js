const express = require('express');
const { signup, login, getMe, verifyOTP, resendOTP } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/verify-otp', protect, verifyOTP);
router.post('/resend-otp', protect, resendOTP);

module.exports = router;