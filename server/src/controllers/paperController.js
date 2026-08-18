import db from '../config/db.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { detectSubjectTitleFromPDF, detectPaperYearAndSessionFromPDF } from '../services/aiService.js';

export async function uploadPapers(req, res) {
  try {
    let { subjectId, year, session } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded' });
    }

    const uploadedRecords = [];

    for (const file of files) {
      const paperId = 'paper_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      let pdfResult = { text: '', pageCount: 1, isScanned: false };

      try {
        pdfResult = await extractTextFromPDF(file.buffer || file.path);
      } catch (pdfErr) {
        console.warn(`Error parsing ${file.originalname}:`, pdfErr.message);
      }

      // AI Detection for Exam Year & Session directly from PDF text header
      const dateInfo = await detectPaperYearAndSessionFromPDF(pdfResult.text, file.originalname);
      const paperYear = Number(year) || dateInfo.year;
      const examSession = session || dateInfo.session;

      // Auto-detect or Create Subject if subjectId missing
      let targetSubjectId = subjectId;
      if (!targetSubjectId) {
        // AI subject detection directly from uploaded PDF header text & filename
        const detectedSubjectName = await detectSubjectTitleFromPDF(pdfResult.text, file.originalname);

        // Check if subject with this exact title exists
        const subCheck = await db.query('SELECT * FROM subjects WHERE title = $1', [detectedSubjectName]);
        if (subCheck.rows.length > 0) {
          targetSubjectId = subCheck.rows[0].id;
        } else {
          targetSubjectId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 3);
          const userId = req.user ? req.user.id : 'u_demo_user';
          await db.query(
            'INSERT INTO subjects (id, user_id, title, code) VALUES ($1, $2, $3, $4)',
            [targetSubjectId, userId, detectedSubjectName, 'CS-' + Math.floor(Math.random() * 900 + 100)]
          );
        }
      }

      await db.query(
        `INSERT INTO papers (id, subject_id, file_name, file_url, year, session, raw_text, is_scanned)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          paperId,
          targetSubjectId,
          file.originalname,
          `/uploads/${file.filename || file.originalname}`,
          paperYear,
          examSession,
          pdfResult.text || '',
          pdfResult.isScanned ? 1 : 0
        ]
      );

      uploadedRecords.push({
        id: paperId,
        subjectId: targetSubjectId,
        fileName: file.originalname,
        year: paperYear,
        session: examSession,
        characterCount: pdfResult.text.length,
        isScanned: pdfResult.isScanned,
        warning: pdfResult.isScanned ? 'This PDF appears to be scanned. OCR support can be enabled for scanned papers.' : null
      });
    }

    res.status(201).json({
      message: `Successfully processed ${uploadedRecords.length} question paper(s)`,
      subjectId: uploadedRecords[0]?.subjectId,
      papers: uploadedRecords
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getSubjectPapers(req, res) {
  try {
    const { subjectId } = req.params;
    const result = await db.query(
      'SELECT id, subject_id, file_name, year, session, is_scanned, created_at, LENGTH(raw_text) as text_length FROM papers WHERE subject_id = $1 ORDER BY year DESC',
      [subjectId]
    );
    res.json({ papers: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePaper(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM papers WHERE id = $1', [id]);
    await db.query('DELETE FROM questions WHERE paper_id = $1', [id]);
    res.json({ message: 'Paper removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
