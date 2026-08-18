import express from 'express';
import { seedDemoData } from '../controllers/demoController.js';

const router = express.Router();

router.post('/seed', seedDemoData);

export default router;
