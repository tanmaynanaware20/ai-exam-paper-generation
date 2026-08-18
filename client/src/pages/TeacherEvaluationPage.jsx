import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { evaluationAPI } from '../services/api';
import { Edit2, Save, RefreshCw, CheckCircle, AlertCircle, MessageSquareText } from 'lucide-react';

export default function TeacherEvaluationPage() {
  const { id = 'att_demo_student_01' } = useParams();
  const [resultData, setResultData] = useState(null);
  const [editingAnsId, setEditingAnsId] = useState(null);
  const [newMarks, setNewMarks] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const res = await evaluationAPI.getAttemptResult(id);
      setResultData(res.data);
    } catch (err) {
      console.error('Fetch result error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (ans) => {
    setEditingAnsId(ans.id);
    setNewMarks(ans.awarded_marks);
    setNewFeedback(ans.feedback || '');
  };

  const handleSaveMarks = async (ansId) => {
    try {
      await evaluationAPI.overrideMarks(id, {
        answerId: ansId,
        newMarks: Number(newMarks),
        feedback: newFeedback
      });
      setActionMsg('Marks updated successfully!');
      setEditingAnsId(null);
      fetchResult();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert('Error updating marks: ' + err.message);
    }
  };

  const handleReEvaluate = async () => {
    if (!window.confirm('Re-evaluate entire submission with AI engine?')) return;
    try {
      await evaluationAPI.reEvaluate(id);
      setActionMsg('Submission re-evaluated with AI!');
      fetchResult();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert('Re-evaluation error: ' + err.message);
    }
  };

  const attempt = resultData?.attempt || {
    student_name: 'Rahul Sharma',
    score: 24,
    total_marks: 30,
    percentage: 80,
    feedback_summary: 'Scored 24/30 (80%)'
  };

  const answers = resultData?.answers || [
    {
      id: 'a1',
      question_id: 'Q1_a',
      question_text: 'Explain virtualization and its primary advantages in cloud infrastructure.',
      student_answer: 'Virtualization allows a single physical server to run multiple virtual machines using a hypervisor. Key benefits include hardware cost saving, efficient resource usage, fast provisioning, and isolation.',
      awarded_marks: 4.5,
      max_marks: 5,
      feedback: 'Great response. Correctly stated definition and key benefits.'
    },
    {
      id: 'a2',
      question_id: 'Q1_b',
      question_text: 'Differentiate between IaaS, PaaS, and SaaS with suitable examples.',
      student_answer: 'IaaS gives raw infrastructure like AWS EC2. PaaS gives runtime environment like Google App Engine. SaaS is ready software like Gmail.',
      awarded_marks: 8.5,
      max_marks: 10,
      feedback: 'Well written and accurate examples.'
    }
  ];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Teacher Review & Grade Override
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Student: <strong>{attempt.student_name}</strong> | Score: <strong>{attempt.score}/{attempt.total_marks} ({attempt.percentage}%)</strong>
          </p>
        </div>

        <button onClick={handleReEvaluate} className="btn btn-secondary">
          <RefreshCw size={16} /> Re-Evaluate with AI Engine
        </button>
      </div>

      {actionMsg && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {actionMsg}
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>Student Submitted Answers & AI Evaluation</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {answers.map((ans, idx) => (
            <div key={ans.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>
                  Question {idx + 1}: {ans.question_id}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-must-study" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                    AI Score: {ans.awarded_marks} / {ans.max_marks} Marks
                  </span>
                  <button onClick={() => handleStartEdit(ans)} className="btn btn-sm btn-secondary">
                    <Edit2 size={14} /> Override Marks
                  </button>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                {ans.question_text}
              </h4>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>
                  Student Response:
                </div>
                {ans.student_answer || <em>No answer submitted.</em>}
              </div>

              {editingAnsId === ans.id ? (
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e', marginBottom: '0.5rem' }}>Teacher Grade Override</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>New Marks</label>
                      <input
                        type="number"
                        className="form-input"
                        value={newMarks}
                        onChange={(e) => setNewMarks(e.target.value)}
                        step="0.5"
                        max={ans.max_marks}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Teacher Feedback Note</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditingAnsId(null)} className="btn btn-sm btn-secondary">Cancel</button>
                    <button onClick={() => handleSaveMarks(ans.id)} className="btn btn-sm btn-success">Save Grade</button>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.85rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 800, color: '#166534', marginBottom: '0.2rem' }}>AI Feedback:</div>
                  <div style={{ color: '#15803d' }}>{ans.feedback}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
