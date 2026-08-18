import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testAPI } from '../services/api';
import { Clock, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Send, Loader2 } from 'lucide-react';

export default function StudentTestPage() {
  const { code } = useParams(); // Test Code
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTestDetails();
  }, [code]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTestDetails = async () => {
    try {
      const res = await testAPI.getByCode(code);
      setTest(res.data);
      setTimeLeft((res.data.duration_minutes || 30) * 60);

      // Flatten questions list
      const qObj = typeof res.data.questions === 'string' ? JSON.parse(res.data.questions) : res.data.questions;
      const list = [];

      if (qObj.sections) {
        qObj.sections.forEach(sec => {
          sec.questions.forEach(q => {
            if (q.subQuestions) {
              q.subQuestions.forEach(sq => {
                list.push({
                  id: `${q.questionNumber}_${sq.subCode}`,
                  qNum: `${q.questionNumber}(${sq.subCode})`,
                  text: sq.text || sq.question_text,
                  marks: sq.marks || 5,
                  unit: sq.unit || q.unit || 1,
                  type: sq.questionType || 'Theory'
                });
              });
            } else {
              list.push({
                id: q.questionNumber,
                qNum: q.questionNumber,
                text: q.questionText || q.text,
                marks: q.totalMarks || 5,
                unit: q.unit || 1,
                type: 'Theory'
              });
            }
          });
        });
      }
      setQuestions(list);
    } catch (err) {
      console.error('Fetch test details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId, text) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const res = await testAPI.submitAttempt({
        testId: test.id,
        testCode: test.test_code,
        answers
      });

      navigate(`/results/${res.data.attemptId}`);
    } catch (err) {
      alert('Error submitting test: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading || !test) {
    return <div className="page-container">Loading test session environment...</div>;
  }

  const currentQ = questions[currentIndex] || { id: 'q1', qNum: 'Q1(a)', text: 'Explain virtualization', marks: 5 };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Test Header */}
      <header style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '0.875rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1e293b'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
            {test.title} (Subject Code: CS-302)
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Live Timer Warning */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: timeLeft < 300 ? '#7f1d1d' : '#1e293b',
          color: timeLeft < 300 ? '#fca5a5' : '#38bdf8',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontWeight: 800,
          fontSize: '1rem',
          fontFamily: 'JetBrains Mono, monospace',
          border: '1px solid #334155'
        }}>
          <Clock size={18} /> {formatTimer(timeLeft)}
        </div>

        <button
          onClick={() => setShowSubmitConfirm(true)}
          className="btn btn-success btn-sm"
        >
          <Send size={14} /> Submit Test
        </button>
      </header>

      {/* Main Examination Question Body */}
      <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Question Stepper Navigation Dots */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: currentIndex === idx ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                backgroundColor: answers[q.id] ? '#10b981' : currentIndex === idx ? '#4f46e5' : '#ffffff',
                color: (answers[q.id] || currentIndex === idx) ? '#ffffff' : '#475569',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', backgroundColor: '#eef2ff', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              {currentQ.qNum}
            </span>
            <span className="badge badge-medium">[{currentQ.marks || 5} Marks]</span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {currentQ.text}
          </h2>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Write your Answer / Working Steps below:</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✓ Autosaved</span>
            </label>
            <textarea
              className="form-textarea"
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Write your explanation, bullet points, numerical steps, or code here..."
              style={{ minHeight: '220px', fontSize: '0.95rem', lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="btn btn-secondary"
          >
            <ArrowLeft size={16} /> Previous Question
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="btn btn-primary"
            >
              Next Question <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="btn btn-success btn-lg"
            >
              Submit Final Test <Send size={18} />
            </button>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d97706', marginBottom: '1rem' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Ready to Submit Test?</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You have answered {Object.keys(answers).length} out of {questions.length} questions. Your answers will be submitted for AI evaluation.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowSubmitConfirm(false)} className="btn btn-secondary" disabled={submitting}>
                Continue Test
              </button>
              <button onClick={handleSubmitTest} className="btn btn-success" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />} Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
