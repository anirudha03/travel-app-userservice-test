import express from 'express';
import { registerUser, loginUser, updateUserProfile, checkUsername, generateOtp, changePassword } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/check-username', checkUsername);
router.post('/generate-otp', generateOtp);
router.post('/change-password', authMiddleware, changePassword); // token required for case 1
router.post('/reset-password', changePassword); // OTP route, no token needed

export default router;
