import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

import paperRoutes from './routes/paperRoutes.js';
import generateRoutes from './routes/generateRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import syllabusRoutes from './routes/syllabusRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/paper', paperRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api', historyRoutes);
app.use('/api', syllabusRoutes);

db.query('SELECT NOW()')
  .then(() => console.log('PostgreSQL Connected'))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});