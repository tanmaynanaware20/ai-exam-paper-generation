import express from 'express';
import multer from 'multer';
import { uploadPapers, getSubjectPapers, deletePaper } from '../controllers/paperController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max file size
});

const router = express.Router();

// Allow both teachers and students to upload & manage PYQ papers
router.post('/upload', authenticateToken, upload.array('files', 10), uploadPapers);
router.get('/:subjectId', authenticateToken, getSubjectPapers);
router.delete('/:id', authenticateToken, deletePaper);

export default router;
