import express from 'express';
import { generatePaper } from '../controllers/generateController.js';

const router = express.Router();

router.post('/generate-create', generatePaper);

export default router;