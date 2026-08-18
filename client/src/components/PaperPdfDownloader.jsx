import React from 'react';
import { Printer, Download, BookOpen, CheckCircle } from 'lucide-react';

export default function PaperPdfDownloader({ paper }) {
  if (!paper) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>University Question Paper Preview</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Print or save directly as PDF using standard browser print layout.</p>
        </div>
        <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Area */}
      <div className="printable-paper" style={{ fontFamily: 'Georgia, serif', color: '#000', lineHeight: '1.6', fontSize: '14px' }}>
        {/* University Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px double #000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            COEP TECHNOLOGICAL UNIVERSITY / SPPU EXAMINATIONS
          </div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', margin: '0.3rem 0' }}>
            {paper.title || paper.subject + ' EXAMINATION PAPER'}
          </div>
          <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#333' }}>
            Pattern: {paper.pattern || 'Standard University Pattern'} | Subject Code: CS-302
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '13px', fontWeight: 'bold', borderTop: '1px solid #ccc', paddingTop: '0.5rem' }}>
            <div>Time: {paper.durationMinutes || 60} Minutes</div>
            <div>Max. Marks: {paper.totalMarks || 30}</div>
          </div>
        </div>

        {/* General Instructions */}
        <div style={{ marginBottom: '1.5rem', fontSize: '12px', borderBottom: '1px solid #ccc', paddingBottom: '0.75rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>Instructions to Candidates:</div>
          <ol style={{ marginLeft: '1.2rem', margin: 0 }}>
            {paper.instructions ? paper.instructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            )) : (
              <>
                <li>Answer Question 1 OR Question 2, Question 3 OR Question 4.</li>
                <li>Neat diagrams must be drawn wherever necessary.</li>
                <li>Figures to the right indicate full marks.</li>
                <li>Assume suitable data if necessary.</li>
              </>
            )}
          </ol>
        </div>

        {/* Sections and Questions */}
        {paper.sections && paper.sections.map((sec, secIdx) => (
          <div key={secIdx} style={{ marginBottom: '2rem' }}>
            {sec.sectionTitle && (
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '1rem 0', textDecoration: 'underline' }}>
                {sec.sectionTitle}
              </div>
            )}

            {sec.questions && sec.questions.map((q, qIdx) => (
              <div key={qIdx} style={{ marginBottom: '1.25rem' }}>
                {q.isOrOption && (
                  <div style={{ textAlign: 'center', fontWeight: 'bold', margin: '1rem 0', letterSpacing: '2px' }}>
                    --- OR ---
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <div>{q.questionNumber || `Q${qIdx + 1}`}. Answer the following:</div>
                  <div>[{q.totalMarks || 10}]</div>
                </div>

                {q.subQuestions ? (
                  <div style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    {q.subQuestions.map((sq, sqIdx) => (
                      <div key={sqIdx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ paddingRight: '1rem' }}>
                          <strong>({sq.subCode || String.fromCharCode(97 + sqIdx)})</strong> {sq.text || sq.question_text}
                        </div>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>[{sq.marks || 5}]</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    {q.text || q.questionText}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
