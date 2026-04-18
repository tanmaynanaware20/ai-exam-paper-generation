import axios from 'axios';

export const generatePaper = async (req, res) => {
  try {
    const { subject, difficulty, totalMarks, oldPaperText } = req.body;

    if (!subject) {
      return res.status(400).json({
        error: 'Subject is required'
      });
    }

    const safePaperText = (oldPaperText || '').slice(0, 1500);

    const finalPrompt = `
STRICT RULE:
Depend ONLY on uploaded paper content.
Never mix other subject topics.

Uploaded paper:
${safePaperText}

Subject: ${subject}
Difficulty: ${difficulty}
Marks: ${totalMarks}

Generate:

SECTION A: Important Topics To Revise
SECTION B: Best Revision Exam Paper
SECTION C: Last Minute Study Focus

Only use uploaded paper topics.
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
        },
        timeout: 20000
      }
    );

    const generatedText =
      response.data?.choices?.[0]?.message?.content || 'No content generated';

    res.json({
      generatedText
    });

  } catch (error) {
    res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        error.message
    });
  }
};