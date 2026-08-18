import db from '../config/db.js';

export async function getSubjects(req, res) {
  try {
    const userId = req.user.id;
    // Return user's subjects OR shared demo subjects
    const result = await db.query(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM papers p WHERE p.subject_id = s.id) as paper_count,
        (SELECT COUNT(*) FROM questions q WHERE q.subject_id = s.id) as question_count
       FROM subjects s 
       WHERE s.user_id = $1 OR s.user_id = 'u_demo_teacher'
       ORDER BY s.created_at DESC`,
      [userId]
    );
    res.json({ subjects: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createSubject(req, res) {
  try {
    const { title, code } = req.body;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Subject title is required' });
    }

    const id = 'sub_' + Date.now();
    const userId = req.user.id;

    await db.query(
      'INSERT INTO subjects (id, user_id, title, code) VALUES ($1, $2, $3, $4)',
      [id, userId, title.trim(), code ? code.trim() : 'CS-' + Math.floor(Math.random() * 900 + 100)]
    );

    const created = await db.query('SELECT * FROM subjects WHERE id = $1', [id]);
    res.status(201).json({ message: 'Subject created', subject: created.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSubject(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM subjects WHERE id = $1', [id]);
    await db.query('DELETE FROM papers WHERE subject_id = $1', [id]);
    await db.query('DELETE FROM questions WHERE subject_id = $1', [id]);
    await db.query('DELETE FROM question_groups WHERE subject_id = $1', [id]);
    res.json({ message: 'Subject and associated data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
