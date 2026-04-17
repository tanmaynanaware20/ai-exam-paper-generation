import express from 'express';
import multer from 'multer';
import {
  uploadSyllabus,
  listSyllabus,
  getSyllabusById,
  updateSyllabus,
  deleteSyllabus
} from '../controllers/syllabusController.js';

const router = express.Router();

const upload = multer({
  dest: 'uploads/'
});

router.post('/syllabus-create', upload.single('file'), uploadSyllabus);
router.get('/syllabus-list', listSyllabus);
router.get('/syllabus-get/:id', getSyllabusById);
router.post('/syllabus-update', updateSyllabus);
router.post('/syllabus-delete', deleteSyllabus);

export default router;