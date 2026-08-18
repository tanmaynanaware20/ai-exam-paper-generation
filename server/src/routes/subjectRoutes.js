import express from 'express';
import { getSubjects, createSubject, deleteSubject } from '../controllers/subjectController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow both teachers and students to create & manage study subjects
router.get('/', authenticateToken, getSubjects);
router.post('/', authenticateToken, createSubject);
router.delete('/:id', authenticateToken, deleteSubject);

export default router;
