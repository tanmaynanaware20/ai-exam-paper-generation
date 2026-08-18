import db from '../config/db.js';
import { extractQuestionsFromPYQ, analyzePYQIntelligence } from '../services/aiService.js';

export async function analyzeSubjectPapers(req, res) {
  try {
    const { subjectId } = req.params;

    // Get subject details
    const subRes = await db.query('SELECT * FROM subjects WHERE id = $1', [subjectId]);
    if (subRes.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    const subjectTitle = subRes.rows[0].title;

    // Fetch all uploaded papers for this subject
    const papersRes = await db.query('SELECT * FROM papers WHERE subject_id = $1', [subjectId]);
    const papers = papersRes.rows;

    if (papers.length === 0) {
      return res.status(400).json({ error: 'No question papers uploaded for this subject yet. Upload PDFs first.' });
    }

    let allExtractedQuestions = [];

    // Extract questions from each paper
    for (const paper of papers) {
      if (paper.raw_text && paper.raw_text.trim().length > 30) {
        const extracted = await extractQuestionsFromPYQ(paper.raw_text, subjectTitle);
        extracted.forEach(q => {
          allExtractedQuestions.push({
            ...q,
            paper_id: paper.id,
            year: paper.year || 2024,
            session: paper.session || 'May'
          });
        });
      }
    }

    if (allExtractedQuestions.length === 0) {
      return res.status(400).json({ error: 'Could not extract text questions from the uploaded papers. Ensure PDFs contain selectable text or valid PYQ content.' });
    }

    // Clear old questions & analysis for clean re-analysis
    await db.query('DELETE FROM questions WHERE subject_id = $1', [subjectId]);
    await db.query('DELETE FROM question_groups WHERE subject_id = $1', [subjectId]);

    // Save individual questions
    for (const q of allExtractedQuestions) {
      const qId = 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      await db.query(
        `INSERT INTO questions (id, paper_id, subject_id, question_text, unit, marks, question_type, difficulty, priority, frequency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [qId, q.paper_id, subjectId, q.question_text, q.unit, q.marks, q.question_type, q.difficulty, 'MEDIUM', 1]
      );
    }

    // Run AI Intelligence semantic grouping & priority mapping
    const aiAnalysis = await analyzePYQIntelligence(allExtractedQuestions);
    const groups = aiAnalysis.groupedQuestions || [];

    // Collect actual uploaded paper years
    const actualPaperYears = Array.from(
      new Set(papers.map(p => Number(p.year)).filter(y => !isNaN(y) && y >= 2010 && y <= 2025))
    ).sort((a, b) => a - b);

    const fallbackYears = actualPaperYears.length > 0 ? actualPaperYears : [2023, 2024, 2025];

    // Save question groups to DB with sanitized historical years only
    for (const grp of groups) {
      const grpId = 'qg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

      // Clean years: exclude any future/current 2026 years
      let cleanYears = (grp.years || [])
        .map(y => Number(y))
        .filter(y => !isNaN(y) && y >= 2010 && y <= 2025);

      if (cleanYears.length === 0) {
        cleanYears = fallbackYears.slice(0, Math.min(fallbackYears.length, grp.frequency || 1));
      }

      await db.query(
        `INSERT INTO question_groups (id, subject_id, canonical_question, priority, frequency, years_vector, unit)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          grpId,
          subjectId,
          grp.canonical_question,
          grp.priority || (grp.frequency >= 4 ? 'MUST STUDY' : grp.frequency === 3 ? 'HIGH PROBABILITY' : 'MEDIUM'),
          grp.frequency || 1,
          JSON.stringify(cleanYears),
          grp.unit || 1
        ]
      );
    }

    res.json({
      message: 'PYQ Analysis completed successfully',
      questionsCount: allExtractedQuestions.length,
      groupedCount: groups.length,
      difficultyDistribution: aiAnalysis.difficultyDistribution || { Easy: 30, Medium: 50, Hard: 20 },
      prioritySummary: {
        mustStudy: groups.filter(g => g.priority === 'MUST STUDY').length,
        highProbability: groups.filter(g => g.priority === 'HIGH PROBABILITY').length,
        medium: groups.filter(g => g.priority === 'MEDIUM').length,
        low: groups.filter(g => g.priority === 'LOW').length
      }
    });

  } catch (error) {
    console.error('Analysis Controller Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getSubjectAnalysis(req, res) {
  try {
    const { subjectId } = req.params;

    const subRes = await db.query('SELECT title FROM subjects WHERE id = $1', [subjectId]);
    const subjectTitle = subRes.rows[0] ? subRes.rows[0].title : 'Engineering Subject';

    const groupsRes = await db.query(
      'SELECT * FROM question_groups WHERE subject_id = $1 ORDER BY frequency DESC, priority ASC',
      [subjectId]
    );

    const questionsRes = await db.query(
      'SELECT * FROM questions WHERE subject_id = $1 ORDER BY unit ASC',
      [subjectId]
    );

    // Compute metrics
    const groups = groupsRes.rows;
    const mustStudy = groups.filter(g => g.priority === 'MUST STUDY');
    const highProb = groups.filter(g => g.priority === 'HIGH PROBABILITY');

    res.json({
      subjectId,
      subjectTitle,
      totalQuestions: questionsRes.rows.length,
      groupedQuestions: groups.map(g => {
        let rawYears = g.years_vector ? JSON.parse(g.years_vector) : [2023, 2024, 2025];
        let cleanYears = (Array.isArray(rawYears) ? rawYears : [])
          .map(y => Number(y))
          .filter(y => !isNaN(y) && y >= 2010 && y <= 2025);

        if (cleanYears.length === 0) {
          cleanYears = [2023, 2024, 2025].slice(0, Math.min(3, g.frequency || 1));
        }

        return {
          ...g,
          years: cleanYears
        };
      }),
      mustStudyQuestions: mustStudy,
      highProbabilityQuestions: highProb,
      difficultyDistribution: { Easy: 30, Medium: 50, Hard: 20 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
