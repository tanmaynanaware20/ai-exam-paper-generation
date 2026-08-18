import express from 'express';
import { getAttemptResult, overrideAnswerMarks, reEvaluateAttempt, listTestSubmissions, deleteSubmission } from '../controllers/evaluationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', authenticateToken, getAttemptResult);
router.post('/:id/re-evaluate', authenticateToken, reEvaluateAttempt);
router.patch('/:id/marks', authenticateToken, overrideAnswerMarks);
router.get('/test/:testId', authenticateToken, listTestSubmissions);
router.delete('/:id', authenticateToken, deleteSubmission);

export default router;
