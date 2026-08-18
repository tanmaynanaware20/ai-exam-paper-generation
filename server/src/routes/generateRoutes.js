import express from 'express';
import { generatePaper, getGeneratedPaper, updateGeneratedPaper, listGeneratedPapers, deleteGeneratedPaper } from '../controllers/generateController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authenticateToken, generatePaper);
router.get('/', authenticateToken, listGeneratedPapers);
router.get('/:id', authenticateToken, getGeneratedPaper);
router.put('/:id', authenticateToken, updateGeneratedPaper);
router.delete('/:id', authenticateToken, deleteGeneratedPaper);

export default router;
