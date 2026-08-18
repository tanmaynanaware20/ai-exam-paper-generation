import express from 'express';
import { createTest, getTestByCode, submitTestAttempt, listTests, deleteTest } from '../controllers/testController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTest);
router.get('/', authenticateToken, listTests);
router.get('/code/:code', authenticateToken, getTestByCode);
router.post('/submit', authenticateToken, submitTestAttempt);
router.delete('/:id', authenticateToken, deleteTest);

export default router;
