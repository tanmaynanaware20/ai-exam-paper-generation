import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('paper'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      filename: req.file.filename,
      path: req.file.path
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;