import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluationAPI } from '../services/api';
import { Award, CheckCircle, AlertTriangle, MessageSquareText, BookOpen, ArrowLeft, RefreshCw } from 'lucide-react';

export default function StudentResultPage() {
  const { id = 'att_demo_student_01' } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const attempt = resultData?.attempt || {
    student_name: 'Rahul Sharma',
    score: 24,
    total_marks: 30,
    percentage: 80,
    feedback_summary: 'Scored 24/30 (80%). Strong understanding of virtualization concepts.'
  };

  const answers = resultData?.answers || [
    {
      id: 'a1',
      question_id: 'Q1_a',
      question_text: 'Explain virtualization and its primary advantages in cloud infrastructure.',
      student_answer: 'Virtualization allows a single physical server to run multiple virtual machines using a hypervisor. Key benefits include hardware cost saving, efficient resource usage, fast provisioning, and isolation.',
      awarded_marks: 4.5,
      max_marks: 5,
      feedback: 'Great response. Correctly stated definition and key benefits.',
      concept_analysis: 'Solid conceptual understanding.'
    },
    {
      id: 'a2',
      question_id: 'Q1_b',
      question_text: 'Differentiate between IaaS, PaaS, and SaaS with suitable examples.',
      student_answer: 'IaaS gives raw infrastructure like AWS EC2. PaaS gives runtime environment like Google App Engine. SaaS is ready software like Gmail.',
      awarded_marks: 8.5,
      max_marks: 10,
      feedback: 'Well written and accurate examples.',
      concept_analysis: 'Complete explanation.'
    },
    {
      id: 'a3',
      question_id: 'Q3_a',
      question_text: 'Describe AWS S3 object storage architecture and bucket policies.',
      student_answer: 'S3 stores files in buckets. It has high durability.',
      awarded_marks: 7.0,
      max_marks: 10,
      feedback: 'Correct definition. Elaborate more on security policies.',
      concept_analysis: 'Fair grasp.'
    },
    {
      id: 'a4',
      question_id: 'Q3_b',
      question_text: 'Explain the principles of IAM (Identity and Access Management).',
      student_answer: 'IAM controls who can access cloud resources using users and policies.',
      awarded_marks: 4.0,
      max_marks: 5,
      feedback: 'Good basic explanation.',
      concept_analysis: 'Good grasp.'
    }
  ];

  return (
    <div className="page-container">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>
            Test Evaluation Completed
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Test Result: {attempt.student_name}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#ecfdf5', marginTop: '0.35rem' }}>
            AI Answer Evaluation & Feedback Breakdown
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', color: '#065f46', padding: '0.75rem 1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Final Score</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{attempt.score} / {attempt.total_marks}</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Percentage</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{attempt.percentage}%</div>
          </div>
        </div>
      </div>

      {/* Question Wise AI Breakdown */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Question-Wise AI Evaluation</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {answers.map((ans, idx) => (
            <div key={ans.id || idx} style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                  Question {idx + 1}
                </span>
                <span className="badge badge-must-study" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                  Awarded: {ans.awarded_marks} / {ans.max_marks} Marks
                </span>
              </div>

              <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                {ans.question_text}
              </h4>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>
                  Student's Answer:
                </div>
                {ans.student_answer || <em>No answer provided.</em>}
              </div>

              <div style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '0.85rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 800, color: '#3730a3', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MessageSquareText size={16} /> AI Evaluator Feedback:
                </div>
                <div style={{ color: '#4338ca', lineHeight: 1.4 }}>{ans.feedback}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
