import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { analyticsAPI, testAPI } from '../services/api';
import { Award, CheckCircle, AlertTriangle, MessageSquareText, ArrowRight, Play, BookOpen } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function StudentDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const res = await analyticsAPI.getStudentStats();
      setStatsData(res.data);
    } catch (err) {
      console.error('Student stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTest = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setErrorMsg('Please enter a test code (e.g., CC2026A01)');
      return;
    }

    try {
      const res = await testAPI.getByCode(joinCode.trim());
      if (res.data) {
        navigate(`/take-test/${res.data.test_code}`);
      }
    } catch (err) {
      setErrorMsg('Invalid Test Code. Try demo test code: CC2026A01');
    }
  };

  const stats = statsData?.stats || {
    testsCompleted: 4,
    averageScore: '80%',
    bestScore: '90%',
    rank: 'Top 15%'
  };

  const unitData = statsData?.unitPerformance || [
    { unit: 'Unit 1: Fundamentals', score: 85 },
    { unit: 'Unit 2: Virtualization', score: 72 },
    { unit: 'Unit 3: AWS Storage', score: 91 },
    { unit: 'Unit 4: Security & IAM', score: 64 }
  ];

  return (
    <div className="page-container">
      {/* Student Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
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
          <div style={{ fontSize: '0.85rem', color: '#bae6fd', fontWeight: 700, textTransform: 'uppercase' }}>
            Student Examination & Evaluation Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            Welcome, Rahul Sharma
          </h1>
          <p style={{ fontSize: '0.925rem', color: '#e0f2fe', marginTop: '0.4rem' }}>
            COEP Technological University | Computer Engineering | 3rd Year (Sem 6)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/ai-assistant" className="btn" style={{ background: '#ffffff', color: '#0369a1', fontWeight: 700 }}>
            <MessageSquareText size={18} /> Ask AI Revision Assistant
          </Link>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.testsCompleted}</div>
            <div className="stat-label">Tests Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.averageScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.bestScore}</div>
            <div className="stat-label">Best Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.rank}</div>
            <div className="stat-label">Class Standing</div>
          </div>
        </div>
      </div>

      {/* Join Test Box & Weak Area Alert */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Join Test */}
        <div className="card" style={{ border: '2px solid #0ea5e9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '0.5rem', borderRadius: '10px' }}>
              <Play size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Join Shared Test</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Enter 8-digit test code provided by teacher</p>
            </div>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleJoinTest} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. CC2026A01"
              style={{ fontWeight: 'bold', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn btn-primary" style={{ background: '#0ea5e9', padding: '0.625rem 1.25rem' }}>
              Attempt <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
            Demo Test Code: <strong style={{ color: '#0ea5e9' }}>CC2026A01</strong> (Engineering Mid-Term Assessment - 30 Marks)
          </div>
        </div>

        {/* Weak Topic Alert */}
        <div className="card" style={{ border: '1px solid #fde68a', backgroundColor: '#fffbeb' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.5rem', borderRadius: '10px', marginTop: '0.2rem' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                AI Performance Diagnosis
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#78350f', marginTop: '0.1rem' }}>
                Weak Topic Identified: Unit 4 (Security & IAM)
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#92400e', marginTop: '0.35rem', lineHeight: 1.4 }}>
                Your average accuracy in Unit 4 is 64%. Review PYQ 2024 and 2025 questions on Hypervisor Security, IAM Policies, and Access Controls.
              </p>
              <Link to="/ai-assistant" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#b45309', marginTop: '0.5rem' }}>
                Get AI Revision Questions on Unit 4 <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Performance Chart & Attempts Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Unit-Wise Performance Accuracy (%)
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="unit" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Previous Test Attempts */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Recent Test Attempts</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Test Code</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>CC2026A01</code></td>
                  <td>24 / 30</td>
                  <td><strong>80%</strong></td>
                  <td>
                    <Link to="/results/att_demo_student_01" className="btn btn-sm btn-secondary">
                      View Evaluation
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td><code>DBMS2026</code></td>
                  <td>42 / 50</td>
                  <td><strong>84%</strong></td>
                  <td>
                    <span className="badge badge-medium">Passed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
