import express from 'express';
import { registerUser, loginUser, updateUserProfile, checkUsername } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/check-username', checkUsername);

export default router;
