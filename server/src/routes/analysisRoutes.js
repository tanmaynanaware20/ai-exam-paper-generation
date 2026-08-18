import express from 'express';
import { analyzeSubjectPapers, getSubjectAnalysis } from '../controllers/analysisController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow both teachers and students to trigger AI PYQ analysis
router.post('/:subjectId', authenticateToken, analyzeSubjectPapers);
router.get('/:subjectId', authenticateToken, getSubjectAnalysis);

export default router;
