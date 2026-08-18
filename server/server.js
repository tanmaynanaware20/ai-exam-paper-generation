import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initDb } from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import subjectRoutes from './src/routes/subjectRoutes.js';
import paperRoutes from './src/routes/paperRoutes.js';
import analysisRoutes from './src/routes/analysisRoutes.js';
import generateRoutes from './src/routes/generateRoutes.js';
import testRoutes from './src/routes/testRoutes.js';
import evaluationRoutes from './src/routes/evaluationRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import demoRoutes from './src/routes/demoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static upload path
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/papers-gen', generateRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', evaluationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/demo', demoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'EXAM-AI Backend Server',
    timestamp: new Date().toISOString()
  });
});

// Initialize database & start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 EXAM-AI Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
