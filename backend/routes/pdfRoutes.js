import express from 'express';
import { generatePDF } from '../controllers/pdfController.js';

const router = express.Router();

router.post('/pdf-create', generatePDF);

export default router;