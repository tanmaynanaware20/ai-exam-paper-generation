import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateProfile, getUserProfileActivity } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.get('/profile/activity', authenticateToken, getUserProfileActivity);

export default router;
