import db from '../config/db.js';

export async function seedDemoData(req, res) {
  try {
    // Universal Multi-Subject Seeds
    const demoSubjects = [
      { id: 'sub_demo_dsa', title: 'Data Structures & Algorithms', code: 'CS-201' },
      { id: 'sub_demo_dbms', title: 'Database Management Systems', code: 'CS-301' },
      { id: 'sub_demo_cloud', title: 'Cloud Computing & Distributed Systems', code: 'CS-302' }
    ];

    for (const sub of demoSubjects) {
      const subCheck = await db.query('SELECT 1 FROM subjects WHERE id = $1 OR title = $2', [sub.id, sub.title]);
      if (subCheck.rows.length === 0) {
        await db.query(
          `INSERT INTO subjects (id, user_id, title, code) VALUES ($1, $2, $3, $4)`,
          [sub.id, 'u_demo_teacher', sub.title, sub.code]
        );
      }
    }

    const demoSubId = 'sub_demo_cloud';

    // 2. Insert Sample PYQ Papers
    const samplePapers = [
      { id: 'paper_2023', year: 2023, session: 'May/June', file: 'PYQ_Paper_2023.pdf' },
      { id: 'paper_2024', year: 2024, session: 'Nov/Dec', file: 'PYQ_Paper_2024.pdf' },
      { id: 'paper_2025', year: 2025, session: 'May/June', file: 'PYQ_Paper_May2025.pdf' }
    ];

    for (const p of samplePapers) {
      const pCheck = await db.query('SELECT 1 FROM papers WHERE id = $1', [p.id]);
      if (pCheck.rows.length === 0) {
        await db.query(
          `INSERT INTO papers (id, subject_id, file_name, file_url, year, session, raw_text, is_scanned)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            p.id,
            demoSubId,
            p.file,
            `/uploads/${p.file}`,
            p.year,
            p.session,
            `Sample PYQ Text for ${p.year} (${p.session}): Explain core subject definitions, architectural components, design trade-offs, numerical derivations, and real-world engineering applications.`,
            0
          ]
        );
      }
    }

    // 3. Insert Extracted Questions & Repeated Groups
    const demoQuestions = [
      { q: 'Explain key architectural principles and design trade-offs with diagrams.', unit: 2, marks: 5, freq: 4, prio: 'MUST STUDY', diff: 'Medium' },
      { q: 'Compare fundamental models and operational paradigms with industry examples.', unit: 1, marks: 5, freq: 4, prio: 'MUST STUDY', diff: 'Easy' },
      { q: 'Differentiate between core structural components and runtime execution engines.', unit: 2, marks: 5, freq: 3, prio: 'HIGH PROBABILITY', diff: 'Medium' },
      { q: 'Describe storage, indexing, and lifecycle management mechanisms.', unit: 3, marks: 5, freq: 3, prio: 'HIGH PROBABILITY', diff: 'Medium' },
      { q: 'Explain security policies, evaluation protocols, and access control models.', unit: 4, marks: 5, freq: 2, prio: 'MEDIUM', diff: 'Hard' }
    ];

    for (const dq of demoQuestions) {
      const qId = 'q_' + Math.random().toString(36).substr(2, 6);
      const qCheck = await db.query('SELECT 1 FROM questions WHERE question_text = $1', [dq.q]);
      if (qCheck.rows.length === 0) {
        await db.query(
          `INSERT INTO questions (id, paper_id, subject_id, question_text, unit, marks, question_type, difficulty, priority, frequency)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [qId, 'paper_2024', demoSubId, dq.q, dq.unit, dq.marks, 'Theory', dq.diff, dq.prio, dq.freq]
        );

        const grpId = 'qg_' + Math.random().toString(36).substr(2, 6);
        await db.query(
          `INSERT INTO question_groups (id, subject_id, canonical_question, priority, frequency, years_vector, unit)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [grpId, demoSubId, dq.q, dq.prio, dq.freq, JSON.stringify([2023, 2024, 2025].slice(0, dq.freq)), dq.unit]
        );
      }
    }

    // 4. Create Generated Paper
    const genId = 'gen_demo_30m';
    const genCheck = await db.query('SELECT 1 FROM generated_papers WHERE id = $1', [genId]);
    if (genCheck.rows.length === 0) {
      const demoGeneratedPaper = {
        title: '30-Mark In-Sem Model Examination Paper',
        subject: 'Engineering Examination',
        totalMarks: 30,
        durationMinutes: 60,
        pattern: 'University In-Sem Exam Pattern',
        instructions: [
          'Answer Q1 OR Q2, and Q3 OR Q4.',
          'Figures to the right indicate full marks.',
          'Assume suitable data wherever necessary.'
        ],
        sections: [
          {
            sectionTitle: 'SECTION A (Unit 1 & Unit 2)',
            questions: [
              {
                questionNumber: 'Q1',
                unit: 1,
                totalMarks: 15,
                isOrOption: false,
                subQuestions: [
                  {
                    subCode: 'a',
                    text: 'Explain primary architectural principles and advantages in modern system design.',
                    marks: 5,
                    questionType: 'Theory',
                    difficulty: 'Medium',
                    referenceAnswer: 'Detailed system architecture explanation, key benefits including scalability, isolation, and cost reduction.'
                  },
                  {
                    subCode: 'b',
                    text: 'Differentiate between core operational paradigms with suitable engineering examples.',
                    marks: 10,
                    questionType: 'Theory',
                    difficulty: 'Easy',
                    referenceAnswer: 'Comprehensive comparison table highlighting structural differences and real-world applications.'
                  }
                ]
              }
            ]
          }
        ]
      };

      await db.query(
        `INSERT INTO generated_papers (id, subject_id, user_id, title, total_marks, difficulty, units_json, pattern, questions_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          genId,
          demoSubId,
          'u_demo_teacher',
          demoGeneratedPaper.title,
          30,
          'Same as PYQs',
          JSON.stringify([1, 2, 3, 4]),
          'University Pattern',
          JSON.stringify(demoGeneratedPaper)
        ]
      );
    }

    // 5. Create Test
    const testId = 'test_demo_01';
    const testCheck = await db.query('SELECT 1 FROM tests WHERE id = $1', [testId]);
    if (testCheck.rows.length === 0) {
      await db.query(
        `INSERT INTO tests (id, generated_paper_id, subject_id, teacher_id, test_code, title, duration_minutes, total_marks, start_date, end_date, max_attempts, questions_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          testId,
          genId,
          demoSubId,
          'u_demo_teacher',
          'CC2026A01',
          'Engineering Mid-Term Assessment 1',
          30,
          30,
          new Date().toISOString(),
          new Date(Date.now() + 14 * 86400000).toISOString(),
          2,
          JSON.stringify({
            title: '30-Mark In-Sem Model Examination Paper',
            subject: 'Engineering Subject',
            totalMarks: 30,
            sections: []
          })
        ]
      );
    }

    res.json({
      message: 'Demo dataset initialized!',
      testCode: 'CC2026A01',
      subjects: demoSubjects
    });

  } catch (error) {
    console.error('Seed Demo Note:', error.message);
    res.json({ message: 'Demo data check complete', note: error.message });
  }
}
