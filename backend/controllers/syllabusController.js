import axios from 'axios';
import db from '../db.js';

export const uploadSyllabus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    const fileName = req.file.originalname;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Generate Computer Engineering university exam paper strictly based on syllabus file ${fileName}. 
Subject must match uploaded syllabus only.

Rules:
- 5 questions
- total 30 marks
- medium difficulty
- university format
- numbered questions
- marks beside each question
- avoid unrelated subjects`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.choices[0].message.content;

    await db.query(
      'INSERT INTO generated_papers(prompt, generated_text) VALUES($1,$2)',
      [fileName, generatedText]
    );

    res.json({
      message: 'Syllabus uploaded successfully',
      fileName,
      generatedText
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const listSyllabus = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM generated_papers ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const getSyllabusById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM generated_papers WHERE id=$1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Syllabus not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const updateSyllabus = async (req, res) => {
  try {
    const { id, prompt, generated_text } = req.body;

    await db.query(
      'UPDATE generated_papers SET prompt=$1, generated_text=$2 WHERE id=$3',
      [prompt, generated_text, id]
    );

    res.json({
      message: 'Updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.body;

    await db.query(
      'DELETE FROM generated_papers WHERE id=$1',
      [id]
    );

    res.json({
      message: 'Deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};