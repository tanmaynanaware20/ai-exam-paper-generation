import db from '../config/db.js';
import { generateQuestionPaper } from '../services/aiService.js';

export async function generatePaper(req, res) {
  try {
    const {
      subjectId,
      totalMarks = 30,
      difficulty = 'Same as PYQs',
      selectedUnits = [1, 2, 3, 4],
      customPrompt = '',
      pattern = 'SPPU University Pattern'
    } = req.body;

    if (!subjectId) {
      return res.status(400).json({ error: 'Subject ID is required' });
    }

    // Fetch Subject
    const subRes = await db.query('SELECT * FROM subjects WHERE id = $1', [subjectId]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    const subjectTitle = subRes.rows[0].title;

    // Fetch PYQ context from uploaded papers and extracted questions
    const papersRes = await db.query('SELECT raw_text FROM papers WHERE subject_id = $1', [subjectId]);
    const questionsRes = await db.query('SELECT question_text, unit, marks, difficulty FROM questions WHERE subject_id = $1', [subjectId]);

    let pyqsContext = papersRes.rows.map(p => p.raw_text).join('\n\n').slice(0, 4000);
    if (questionsRes.rows.length > 0) {
      pyqsContext += '\n\nExtracted Question Bank:\n' + questionsRes.rows.map(q => `- ${q.question_text} [Unit ${q.unit}, ${q.marks}M]`).join('\n');
    }

    // Call AI Paper Generator
    const generatedPaper = await generateQuestionPaper({
      subjectTitle,
      totalMarks: Number(totalMarks),
      difficulty,
      selectedUnits: Array.isArray(selectedUnits) ? selectedUnits : [1, 2, 3, 4],
      pyqsContext,
      customPrompt,
      pattern
    });

    if (generatedPaper.insufficientData) {
      return res.status(400).json({
        error: generatedPaper.error,
        insufficientData: true
      });
    }

    // Save to Database
    const genId = 'gen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const userId = req.user ? req.user.id : 'u_demo_teacher';

    await db.query(
      `INSERT INTO generated_papers (id, subject_id, user_id, title, total_marks, difficulty, units_json, pattern, questions_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        genId,
        subjectId,
        userId,
        generatedPaper.title || `${subjectTitle} ${totalMarks}-Mark Model Paper`,
        Number(totalMarks),
        difficulty,
        JSON.stringify(selectedUnits),
        pattern,
        JSON.stringify(generatedPaper)
      ]
    );

    res.status(201).json({
      message: 'Question paper generated successfully',
      generatedPaperId: genId,
      paper: generatedPaper
    });

  } catch (error) {
    console.error('Generate Controller Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getGeneratedPaper(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM generated_papers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Generated paper not found' });
    }
    const row = result.rows[0];
    res.json({
      ...row,
      questions: JSON.parse(row.questions_json),
      units: JSON.parse(row.units_json || '[]')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateGeneratedPaper(req, res) {
  try {
    const { id } = req.params;
    const { questions_json, title } = req.body;

    await db.query(
      'UPDATE generated_papers SET questions_json = $1, title = $2 WHERE id = $3',
      [typeof questions_json === 'string' ? questions_json : JSON.stringify(questions_json), title, id]
    );

    res.json({ message: 'Generated paper updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listGeneratedPapers(req, res) {
  try {
    const { subjectId } = req.query;
    let query = 'SELECT id, subject_id, title, total_marks, difficulty, pattern, created_at FROM generated_papers';
    let params = [];
    if (subjectId) {
      query += ' WHERE subject_id = $1';
      params.push(subjectId);
    }
    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json({ papers: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteGeneratedPaper(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM generated_papers WHERE id = $1', [id]);
    res.json({ message: 'Generated paper deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
