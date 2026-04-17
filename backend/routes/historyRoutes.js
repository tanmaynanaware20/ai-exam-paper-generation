import express from 'express';
import {
  createHistory,
  getHistory,
  getHistoryById,
  updateHistory,
  deleteHistory
} from '../controllers/historyController.js';

const router = express.Router();

router.post('/history-create', createHistory);
router.get('/history-list', getHistory);
router.get('/history-get/:id', getHistoryById);
router.post('/history-update', updateHistory);
router.post('/history-delete', deleteHistory);

export default router;