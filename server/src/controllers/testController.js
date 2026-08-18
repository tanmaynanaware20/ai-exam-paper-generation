import db from '../config/db.js';
import { evaluateStudentAnswerWithAI } from '../services/aiService.js';

export async function createTest(req, res) {
  try {
    const {
      generatedPaperId,
      subjectId,
      title,
      durationMinutes = 30,
      totalMarks = 30,
      startDate,
      endDate,
      maxAttempts = 1,
      questions
    } = req.body;

    const teacherId = req.user ? req.user.id : 'u_demo_teacher';
    const testId = 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    // Generate readable test code e.g. CC2026A01
    const testCode = 'CC' + new Date().getFullYear() + Math.random().toString(36).substr(2, 3).toUpperCase();

    // Flatten or format test questions into attempt structure
    const questionsJson = typeof questions === 'string' ? questions : JSON.stringify(questions);

    await db.query(
      `INSERT INTO tests (id, generated_paper_id, subject_id, teacher_id, test_code, title, duration_minutes, total_marks, start_date, end_date, max_attempts, questions_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        testId,
        generatedPaperId || null,
        subjectId,
        teacherId,
        testCode,
        title || 'Unit Test Paper',
        Number(durationMinutes),
        Number(totalMarks),
        startDate || new Date().toISOString(),
        endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
        Number(maxAttempts),
        questionsJson
      ]
    );

    res.status(201).json({
      message: 'Test created successfully',
      testId,
      testCode,
      shareLink: `/test/${testCode}`
    });
  } catch (error) {
    console.error('Create Test Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getTestByCode(req, res) {
  try {
    const { code } = req.params;
    const result = await db.query('SELECT * FROM tests WHERE test_code = $1 OR id = $2', [code, code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found with code: ' + code });
    }

    const test = result.rows[0];
    res.json({
      ...test,
      questions: JSON.parse(test.questions_json)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function submitTestAttempt(req, res) {
  try {
    const { testId, testCode, answers } = req.body;
    const studentId = req.user ? req.user.id : 'u_demo_student';
    const studentName = req.user ? req.user.name : 'Rahul Sharma';

    const testRes = await db.query('SELECT * FROM tests WHERE id = $1 OR test_code = $2', [testId, testCode]);
    if (testRes.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = testRes.rows[0];
    const attemptId = 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    let totalScore = 0;
    const questionsData = JSON.parse(test.questions_json);
    const evaluatedAnswers = [];

    // Helper to flatten questions from paper structure
    const flatQuestions = [];
    if (questionsData.sections) {
      questionsData.sections.forEach(sec => {
        sec.questions.forEach(q => {
          if (q.subQuestions) {
            q.subQuestions.forEach(sq => {
              flatQuestions.push({
                qId: `${q.questionNumber}_${sq.subCode}`,
                text: sq.text,
                marks: sq.marks || 5,
                ref: sq.referenceAnswer || ''
              });
            });
          } else {
            flatQuestions.push({
              qId: q.questionNumber,
              text: q.questionText || q.text,
              marks: q.totalMarks || q.marks || 5,
              ref: q.referenceAnswer || ''
            });
          }
        });
      });
    } else if (Array.isArray(questionsData)) {
      questionsData.forEach((q, idx) => {
        flatQuestions.push({
          qId: `q_${idx + 1}`,
          text: q.text || q.question_text,
          marks: q.marks || 5,
          ref: q.referenceAnswer || ''
        });
      });
    }

    // Evaluate answers
    for (const fq of flatQuestions) {
      const studentAns = answers[fq.qId] || answers[fq.text] || '';
      const evalRes = await evaluateStudentAnswerWithAI({
        questionText: fq.text,
        referenceAnswer: fq.ref,
        maxMarks: fq.marks,
        studentAnswer: studentAns
      });

      totalScore += evalRes.awarded_marks;

      const ansId = 'ans_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      await db.query(
        `INSERT INTO student_answers (id, attempt_id, question_id, question_text, student_answer, reference_answer, awarded_marks, max_marks, feedback, concept_analysis, is_evaluated)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          ansId,
          attemptId,
          fq.qId,
          fq.text,
          studentAns,
          fq.ref,
          evalRes.awarded_marks,
          fq.marks,
          evalRes.feedback,
          evalRes.concept_analysis,
          1
        ]
      );

      evaluatedAnswers.push({
        questionId: fq.qId,
        questionText: fq.text,
        studentAnswer: studentAns,
        awardedMarks: evalRes.awarded_marks,
        maxMarks: fq.marks,
        feedback: evalRes.feedback,
        correctPoints: evalRes.correct_points,
        missingPoints: evalRes.missing_points
      });
    }

    const percentage = Math.round((totalScore / test.total_marks) * 100);

    // Save Attempt
    await db.query(
      `INSERT INTO test_attempts (id, test_id, test_code, student_id, student_name, score, total_marks, percentage, status, feedback_summary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        attemptId,
        test.id,
        test.test_code,
        studentId,
        studentName,
        totalScore,
        test.total_marks,
        percentage,
        'evaluated',
        `Scored ${totalScore}/${test.total_marks} (${percentage}%)`
      ]
    );

    res.status(201).json({
      message: 'Test submitted and evaluated successfully',
      attemptId,
      score: totalScore,
      totalMarks: test.total_marks,
      percentage,
      evaluatedAnswers
    });

  } catch (error) {
    console.error('Submit Test Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function listTests(req, res) {
  try {
    const result = await db.query(
      `SELECT t.*, s.title as subject_title,
        (SELECT COUNT(*) FROM test_attempts ta WHERE ta.test_id = t.id) as attempt_count
       FROM tests t
       LEFT JOIN subjects s ON t.subject_id = s.id
       ORDER BY t.created_at DESC`
    );
    res.json({ tests: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteTest(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tests WHERE id = $1', [id]);
    await db.query('DELETE FROM test_attempts WHERE test_id = $1', [id]);
    res.json({ message: 'Test and associated attempts deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
