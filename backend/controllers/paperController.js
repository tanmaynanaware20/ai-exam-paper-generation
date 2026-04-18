import db from '../db.js';
import fs from 'fs';
import pdf from 'pdf-parse';

export const uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const fileName = req.file.originalname;
    const filePath = req.file.path;

    let extractedText = '';

    if (fileName.toLowerCase().endsWith('.pdf')) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    } else {
      extractedText = fileName;
    }

    await db.query(
      'INSERT INTO old_papers(subject, paper_text) VALUES($1,$2)',
      ['DBMS', extractedText]
    );

    res.json({
      message: 'Paper uploaded successfully',
      fileName,
      filePath,
      extractedText
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const getPaper = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM old_papers ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM old_papers WHERE id=$1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Paper not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const updatePaper = async (req, res) => {
  try {
    const { id, subject, paper_text } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Id is required'
      });
    }

    const result = await db.query(
      'UPDATE old_papers SET subject=$1, paper_text=$2 WHERE id=$3 RETURNING *',
      [subject, paper_text, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Paper not found'
      });
    }

    res.json({
      message: 'Paper updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Id is required'
      });
    }

    const result = await db.query(
      'DELETE FROM old_papers WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Paper not found'
      });
    }

    res.json({
      message: 'Paper deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};