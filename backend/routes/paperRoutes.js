import express from 'express';
import multer from 'multer';
import {
  uploadPaper,
  getPaper,
  getPaperById,
  updatePaper,
  deletePaper
} from '../controllers/paperController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/paper-create', upload.single('file'), uploadPaper);
router.get('/paper-list', getPaper);
router.get('/paper-get/:id', getPaperById);
router.post('/paper-update', updatePaper);
router.post('/paper-delete', deletePaper);

export default router;