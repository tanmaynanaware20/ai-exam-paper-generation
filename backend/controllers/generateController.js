import axios from 'axios';
import db from '../db.js';

export const generatePaper = async (req, res) => {
  try {
    const { prompt, difficulty, marks } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    const finalPrompt = `
Generate university exam paper for subject ${prompt}

Rules:
- Difficulty: ${difficulty || 'medium'}
- Total Marks: ${marks || 30}
- 5 Questions
- University format
- Numbered questions
- Marks beside each question
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: finalPrompt
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

    const generatedText =
      response.data.choices[0].message.content;

    const result = await db.query(
      'INSERT INTO generated_papers(prompt, generated_text) VALUES($1,$2) RETURNING *',
      [finalPrompt, generatedText]
    );

    res.json({
      id: result.rows[0].id,
      prompt: finalPrompt,
      generatedText
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};