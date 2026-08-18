import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generatorAPI, testAPI } from '../services/api';
import { Edit2, Save, Trash2, Plus, Printer, Award, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import PaperPdfDownloader from '../components/PaperPdfDownloader';

export default function GeneratedPaperEditorPage() {
  const { id } = useParams();
  const [paperData, setPaperData] = useState(null);
  const [paperObj, setPaperObj] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testModal, setTestModal] = useState(false);

  // Test Creation Form State
  const [testTitle, setTestTitle] = useState('');
  const [duration, setDuration] = useState(30);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPaperDetails();
  }, [id]);

  const fetchPaperDetails = async () => {
    try {
      const res = await generatorAPI.getById(id);
      setPaperData(res.data);
      const parsed = typeof res.data.questions === 'string' ? JSON.parse(res.data.questions) : res.data.questions;
      setPaperObj(parsed);
      setTestTitle(parsed.title || 'Cloud Computing Unit Test 1');
      setDuration(parsed.durationMinutes || 30);
    } catch (err) {
      console.error('Fetch paper error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (secIdx, qIdx, sqIdx, newText) => {
    const updated = JSON.parse(JSON.stringify(paperObj));
    if (sqIdx !== null) {
      updated.sections[secIdx].questions[qIdx].subQuestions[sqIdx].text = newText;
    } else {
      updated.sections[secIdx].questions[qIdx].questionText = newText;
    }
    setPaperObj(updated);
  };

  const handleMarksChange = (secIdx, qIdx, sqIdx, newMarks) => {
    const updated = JSON.parse(JSON.stringify(paperObj));
    if (sqIdx !== null) {
      updated.sections[secIdx].questions[qIdx].subQuestions[sqIdx].marks = Number(newMarks);
    } else {
      updated.sections[secIdx].questions[qIdx].totalMarks = Number(newMarks);
    }
    setPaperObj(updated);
  };

  const handleDeleteQuestion = (secIdx, qIdx, sqIdx) => {
    const updated = JSON.parse(JSON.stringify(paperObj));
    if (sqIdx !== null) {
      updated.sections[secIdx].questions[qIdx].subQuestions.splice(sqIdx, 1);
    } else {
      updated.sections[secIdx].questions.splice(qIdx, 1);
    }
    setPaperObj(updated);
  };

  const handleSavePaper = async () => {
    setSaving(true);
    try {
      await generatorAPI.updatePaper(id, {
        questions_json: paperObj,
        title: paperObj.title
      });
      alert('Generated paper updated successfully!');
    } catch (err) {
      alert('Error saving paper: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      const res = await testAPI.create({
        generatedPaperId: id,
        subjectId: paperData.subject_id,
        title: testTitle,
        durationMinutes: duration,
        totalMarks: paperObj.totalMarks || 30,
        questions: paperObj
      });

      alert(`Test Created Successfully!\nTest Code: ${res.data.testCode}`);
      setTestModal(false);
      navigate('/tests');
    } catch (err) {
      alert('Error creating test: ' + err.message);
    }
  };

  if (loading || !paperObj) {
    return <div className="page-container">Loading generated paper details...</div>;
  }

  // Calculate sum of marks
  let calculatedSum = 0;
  if (paperObj.sections) {
    paperObj.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (!q.isOrOption) {
          if (q.subQuestions) {
            q.subQuestions.forEach(sq => { calculatedSum += (sq.marks || 0); });
          } else {
            calculatedSum += (q.totalMarks || 0);
          }
        }
      });
    });
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={() => navigate('/generator')} className="btn btn-sm btn-secondary" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Generator
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {paperObj.title || 'Generated Question Paper'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <span className="badge badge-medium">Target: {paperObj.totalMarks || 30} Marks</span>
            <span className={`badge ${calculatedSum === (paperObj.totalMarks || 30) ? 'badge-must-study' : 'badge-high-prob'}`}>
              Calculated Total: {calculatedSum} Marks {calculatedSum === (paperObj.totalMarks || 30) ? '✓ Matched' : '⚠️ Adjust Marks'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleSavePaper} disabled={saving} className="btn btn-secondary">
            <Save size={16} /> Save Changes
          </button>
          <button onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')} className="btn btn-secondary">
            <Printer size={16} /> {activeTab === 'editor' ? 'University PDF Preview' : 'Interactive Editor'}
          </button>
          <button onClick={() => setTestModal(true)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <Award size={16} /> Create Student Test
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <PaperPdfDownloader paper={paperObj} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {paperObj.sections && paperObj.sections.map((sec, secIdx) => (
            <div key={secIdx} className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4f46e5', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                {sec.sectionTitle || `SECTION ${secIdx + 1}`}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sec.questions && sec.questions.map((q, qIdx) => (
                  <div key={qIdx} style={{ backgroundColor: q.isOrOption ? '#fefce8' : '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                        {q.questionNumber} {q.isOrOption && '(OR CHOICE)'}
                      </span>
                      <button onClick={() => handleDeleteQuestion(secIdx, qIdx, null)} className="btn btn-sm btn-danger">
                        <Trash2 size={14} /> Remove Q
                      </button>
                    </div>

                    {q.subQuestions ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem' }}>
                        {q.subQuestions.map((sq, sqIdx) => (
                          <div key={sqIdx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <strong style={{ marginTop: '0.5rem' }}>({sq.subCode || String.fromCharCode(97 + sqIdx)})</strong>
                            <div style={{ flex: 1 }}>
                              <textarea
                                className="form-textarea"
                                value={sq.text || sq.question_text}
                                onChange={(e) => handleTextChange(secIdx, qIdx, sqIdx, e.target.value)}
                                style={{ minHeight: '60px', marginBottom: '0.35rem' }}
                              />
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Ref Concept: {sq.referenceAnswer || 'Standard concept definition'}
                              </div>
                            </div>

                            <div style={{ width: '90px' }}>
                              <label style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>Marks</label>
                              <input
                                type="number"
                                className="form-input"
                                value={sq.marks || 5}
                                onChange={(e) => handleMarksChange(secIdx, qIdx, sqIdx, e.target.value)}
                              />
                            </div>

                            <button onClick={() => handleDeleteQuestion(secIdx, qIdx, sqIdx)} className="btn btn-sm btn-danger" style={{ marginTop: '1.25rem' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="form-textarea"
                        value={q.questionText || q.text}
                        onChange={(e) => handleTextChange(secIdx, qIdx, null, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Test Modal */}
      {testModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              Create Online Student Test
            </h2>
            <form onSubmit={handleCreateTest}>
              <div className="form-group">
                <label className="form-label">Test Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setTestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <Award size={16} /> Publish Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
