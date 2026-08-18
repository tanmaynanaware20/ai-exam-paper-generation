import express from 'express';
import { getTeacherAnalytics, getStudentAnalytics, aiStudyAssistant } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/teacher', authenticateToken, getTeacherAnalytics);
router.get('/student', authenticateToken, getStudentAnalytics);
router.post('/ai-assistant', authenticateToken, aiStudyAssistant);

export default router;
