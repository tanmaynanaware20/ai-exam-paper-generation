import db from '../config/db.js';
import { evaluateStudentAnswerWithAI } from '../services/aiService.js';

export async function getAttemptResult(req, res) {
  try {
    const { id } = req.params;
    const attemptRes = await db.query('SELECT * FROM test_attempts WHERE id = $1', [id]);

    if (attemptRes.rows.length === 0) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }

    const attempt = attemptRes.rows[0];
    const answersRes = await db.query('SELECT * FROM student_answers WHERE attempt_id = $1 ORDER BY id ASC', [id]);
    const testRes = await db.query('SELECT * FROM tests WHERE id = $1', [attempt.test_id]);

    res.json({
      attempt,
      test: testRes.rows[0] || null,
      answers: answersRes.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function overrideAnswerMarks(req, res) {
  try {
    const { id } = req.params; // attemptId
    const { answerId, newMarks, feedback } = req.body;

    if (answerId) {
      await db.query(
        'UPDATE student_answers SET awarded_marks = $1, feedback = $2 WHERE id = $3',
        [Number(newMarks), feedback || 'Grade overridden by Teacher', answerId]
      );
    }

    // Recalculate attempt total score
    const sumRes = await db.query('SELECT SUM(awarded_marks) as total FROM student_answers WHERE attempt_id = $1', [id]);
    const newTotal = Number(sumRes.rows[0].total || 0);

    const attRes = await db.query('SELECT total_marks FROM test_attempts WHERE id = $1', [id]);
    const maxMarks = attRes.rows[0] ? attRes.rows[0].total_marks : 30;
    const percentage = Math.round((newTotal / maxMarks) * 100);

    await db.query(
      'UPDATE test_attempts SET score = $1, percentage = $2, feedback_summary = $3 WHERE id = $4',
      [newTotal, percentage, `Updated by Teacher: ${newTotal}/${maxMarks} (${percentage}%)`, id]
    );

    // Save evaluation audit log
    await db.query(
      'INSERT INTO evaluations (id, attempt_id, teacher_override, evaluation_json) VALUES ($1, $2, $3, $4)',
      ['eval_' + Date.now(), id, 1, JSON.stringify({ updatedAnswerId: answerId, newMarks, newTotal })]
    );

    res.json({
      message: 'Marks updated successfully',
      newScore: newTotal,
      percentage
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function reEvaluateAttempt(req, res) {
  try {
    const { id } = req.params; // attemptId
    const answersRes = await db.query('SELECT * FROM student_answers WHERE attempt_id = $1', [id]);

    let newTotal = 0;

    for (const ans of answersRes.rows) {
      const evalRes = await evaluateStudentAnswerWithAI({
        questionText: ans.question_text,
        referenceAnswer: ans.reference_answer,
        maxMarks: ans.max_marks,
        studentAnswer: ans.student_answer
      });

      newTotal += evalRes.awarded_marks;

      await db.query(
        `UPDATE student_answers SET awarded_marks = $1, feedback = $2, concept_analysis = $3 WHERE id = $4`,
        [evalRes.awarded_marks, evalRes.feedback, evalRes.concept_analysis, ans.id]
      );
    }

    const attRes = await db.query('SELECT total_marks FROM test_attempts WHERE id = $1', [id]);
    const maxMarks = attRes.rows[0] ? attRes.rows[0].total_marks : 30;
    const percentage = Math.round((newTotal / maxMarks) * 100);

    await db.query(
      'UPDATE test_attempts SET score = $1, percentage = $2, feedback_summary = $3 WHERE id = $4',
      [newTotal, percentage, `AI Re-evaluated: ${newTotal}/${maxMarks} (${percentage}%)`, id]
    );

    res.json({
      message: 'Attempt re-evaluated with AI engine',
      newScore: newTotal,
      percentage
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listTestSubmissions(req, res) {
  try {
    const { testId } = req.params;
    const result = await db.query(
      'SELECT * FROM test_attempts WHERE test_id = $1 OR test_code = $2 ORDER BY submitted_at DESC',
      [testId, testId]
    );
    res.json({ submissions: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSubmission(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM test_attempts WHERE id = $1', [id]);
    await db.query('DELETE FROM student_answers WHERE attempt_id = $1', [id]);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
