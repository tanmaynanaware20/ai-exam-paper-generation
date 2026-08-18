import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { analyticsAPI, subjectAPI } from '../services/api';
import { BookOpen, Upload, Sparkles, Award, Users, CheckCircle, BarChart3, ArrowRight, MessageSquareText, FileText } from 'lucide-react';
import AIPromptBoxModal from '../components/AIPromptBoxModal';

export default function TeacherDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPromptBox, setShowPromptBox] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [anaRes, subRes] = await Promise.all([
        analyticsAPI.getTeacherStats(),
        subjectAPI.getAll()
      ]);
      setAnalytics(anaRes.data);
      setSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics?.stats || {
    subjects: 5,
    papersUploaded: 31,
    generatedPapers: 14,
    testsCreated: 8,
    studentsCount: 124,
    totalSubmissions: 318,
    averageScore: 22.4,
    averagePercentage: 74.6
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
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
          <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            EXAM-AI Academic Admin Console
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Teacher Examination Dashboard
          </h1>
          <p style={{ fontSize: '0.925rem', color: '#cbd5e1', marginTop: '0.4rem', maxWidth: '650px' }}>
            Upload PYQs, analyze paper frequencies, generate 30 & 70-mark university question papers, conduct online student tests, and review AI evaluations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowPromptBox(true)}
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '0.75rem 1.25rem' }}
          >
            <Sparkles size={18} /> Ask EXAM-AI Prompt Box
          </button>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.subjects}</div>
            <div className="stat-label">Active Subjects</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Upload size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.papersUploaded}</div>
            <div className="stat-label">PYQ Papers Uploaded</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.generatedPapers}</div>
            <div className="stat-label">Generated Papers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.testsCreated}</div>
            <div className="stat-label">Online Tests</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.studentsCount}</div>
            <div className="stat-label">Enrolled Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.totalSubmissions}</div>
            <div className="stat-label">Evaluated Attempts</div>
          </div>
        </div>
      </div>

      {/* AI Prompt Box Trigger / Embedded */}
      {showPromptBox && (
        <div style={{ marginBottom: '2rem' }}>
          <AIPromptBoxModal onClose={() => setShowPromptBox(false)} />
        </div>
      )}

      {/* Quick Action Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card card-hover" onClick={() => navigate('/subjects')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Upload size={24} color="#4f46e5" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>PYQ Upload & Manage</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Upload May/Nov previous year question papers (PDF format) and extract clean text.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4f46e5', fontWeight: 700, fontSize: '0.85rem' }}>
            Upload PYQs <ArrowRight size={16} />
          </div>
        </div>

        <div className="card card-hover" onClick={() => navigate('/analysis/sub_demo_cloud')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <BarChart3 size={24} color="#0ea5e9" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>PYQ Intelligence</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            View repeated questions, MUST STUDY priority tags, and frequency distributions.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0ea5e9', fontWeight: 700, fontSize: '0.85rem' }}>
            View PYQ Intelligence <ArrowRight size={16} />
          </div>
        </div>

        <div className="card card-hover" onClick={() => navigate('/generator')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Sparkles size={24} color="#8b5cf6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>30 & 70-Mark Generator</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Generate university model question papers with exact mark total validation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#8b5cf6', fontWeight: 700, fontSize: '0.85rem' }}>
            Generate Paper <ArrowRight size={16} />
          </div>
        </div>

        <div className="card card-hover" onClick={() => navigate('/tests')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Award size={24} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Student Tests & Grading</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Share test codes (e.g. CC2026A01) and review AI evaluation results with mark overrides.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
            Manage Tests <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Main Subjects Table & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Subject PYQ Libraries</h3>
            <button className="btn btn-sm btn-primary" onClick={() => navigate('/subjects')}>
              + Add Subject
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>PYQ Papers</th>
                  <th>Question Bank</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? subjects.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{sub.title}</strong>
                    </td>
                    <td><code>{sub.code || 'CS-302'}</code></td>
                    <td>
                      <span className="badge badge-medium">{sub.paper_count || 3} Papers</span>
                    </td>
                    <td>{sub.question_count || 24} Questions</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/analysis/${sub.id}`} className="btn btn-sm btn-secondary">
                          Analysis
                        </Link>
                        <Link to={`/generator?subjectId=${sub.id}`} className="btn btn-sm btn-primary">
                          Generate
                        </Link>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      Loading subject datasets...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Active Test Summary */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Active Demo Test</h3>
          <div style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' }}>
              Test Code
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', fontFamily: 'JetBrains Mono, monospace' }}>
              CC2026A01
            </div>
            <div style={{ fontSize: '0.85rem', color: '#4338ca', fontWeight: 600, marginTop: '0.25rem' }}>
              Engineering Mid-Term Assessment (30 Marks)
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Students can join test immediately using code <strong>CC2026A01</strong> or direct share link.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/evaluations/att_demo_student_01" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle size={16} /> View Evaluated Results
            </Link>
            <Link to="/tests" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              View All Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
