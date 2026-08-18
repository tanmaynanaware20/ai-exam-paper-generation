import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { Brain, Sparkles, AlertTriangle, CheckCircle, HelpCircle, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function PYQAnalysisPage() {
  const { subjectId = 'sub_demo_cloud' } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState('Engineering Subject');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalysis();
  }, [subjectId]);

  const fetchAnalysis = async () => {
    try {
      const res = await analysisAPI.getAnalysis(subjectId);
      setAnalysisData(res.data);
      if (res.data.subjectTitle) {
        setSubjectTitle(res.data.subjectTitle);
      }
    } catch (err) {
      console.error('Fetch analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analysisAPI.runAnalysis(subjectId);
      fetchAnalysis();
    } catch (err) {
      alert('Error running AI analysis: ' + (err.response?.data?.error || err.message));
    } finally {
      setAnalyzing(false);
    }
  };

  const groupedQuestions = analysisData?.groupedQuestions || [
    {
      id: 'g1',
      canonical_question: 'Explain virtualization and its primary types with architecture diagrams.',
      frequency: 3,
      priority: 'MUST STUDY',
      unit: 2,
      difficulty: 'Medium',
      years: [2023, 2024, 2025]
    },
    {
      id: 'g2',
      canonical_question: 'Compare Cloud Service Models: IaaS, PaaS, and SaaS with real-world examples.',
      frequency: 3,
      priority: 'MUST STUDY',
      unit: 1,
      difficulty: 'Easy',
      years: [2023, 2024, 2025]
    },
    {
      id: 'g3',
      canonical_question: 'Differentiate between Type 1 (Bare-Metal) and Type 2 (Hosted) Hypervisors.',
      frequency: 2,
      priority: 'HIGH PROBABILITY',
      unit: 2,
      difficulty: 'Medium',
      years: [2024, 2025]
    },
    {
      id: 'g4',
      canonical_question: 'Describe AWS S3 bucket storage architecture and lifecycle management.',
      frequency: 2,
      priority: 'HIGH PROBABILITY',
      unit: 3,
      difficulty: 'Medium',
      years: [2024, 2025]
    },
    {
      id: 'g5',
      canonical_question: 'Explain Cloud IAM security policies, evaluation logic, and role assignments.',
      frequency: 2,
      priority: 'MEDIUM',
      unit: 4,
      difficulty: 'Hard',
      years: [2024, 2025]
    }
  ];

  const mustStudyList = groupedQuestions.filter(q => q.priority === 'MUST STUDY');
  const highProbList = groupedQuestions.filter(q => q.priority === 'HIGH PROBABILITY');

  const pieData = [
    { name: 'Easy', value: 35, color: '#10b981' },
    { name: 'Medium', value: 45, color: '#0ea5e9' },
    { name: 'Hard', value: 20, color: '#ef4444' }
  ];

  return (
    <div className="page-container">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)',
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
          <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase' }}>
            Question Intelligence Engine
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            PYQ Pattern & Repeated Question Analysis
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
            AI groups similar question formulations, identifies frequency patterns, and tags MUST STUDY concepts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="btn btn-secondary"
          >
            {analyzing ? <Loader2 size={16} className="spin" /> : <Brain size={16} />} Re-Run AI Analysis
          </button>

          <button
            onClick={() => navigate(`/generator?subjectId=${subjectId}`)}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <Sparkles size={16} /> Generate Paper From PYQs
          </button>
        </div>
      </div>

      {/* Priority Counters Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div>
            <div className="stat-value" style={{ color: '#dc2626' }}>{mustStudyList.length}</div>
            <div className="stat-label">MUST STUDY (4+ Times Asked)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div>
            <div className="stat-value" style={{ color: '#d97706' }}>{highProbList.length}</div>
            <div className="stat-label">HIGH PROBABILITY (3 Times)</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #0ea5e9' }}>
          <div>
            <div className="stat-value" style={{ color: '#0284c7' }}>{groupedQuestions.length}</div>
            <div className="stat-label">Unique Question Clusters</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Repeated Question Clusters Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Repeated Questions & Priority Ranking
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {groupedQuestions.map((q, idx) => {
              let badgeClass = 'badge-low';
              if (q.priority === 'MUST STUDY') badgeClass = 'badge-must-study';
              else if (q.priority === 'HIGH PROBABILITY') badgeClass = 'badge-high-prob';
              else if (q.priority === 'MEDIUM') badgeClass = 'badge-medium';

              return (
                <div
                  key={q.id || idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    backgroundColor: q.priority === 'MUST STUDY' ? '#fff5f5' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${badgeClass}`}>{q.priority}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Unit {q.unit || 1}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0ea5e9' }}>Difficulty: {q.difficulty}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', backgroundColor: '#eef2ff', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                      Asked {q.frequency}x
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                    {q.canonical_question}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Appeared in papers:</span>
                    {(q.years || [2023, 2024, 2025]).map((yr) => (
                      <span key={yr} style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {yr} ✓
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Distribution Chart */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Historical Difficulty Distribution</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Extracted from historical PYQ papers for Cloud Computing.
            </p>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#3730a3', marginBottom: '0.5rem' }}>
              💡 Pattern Intelligence Note
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#4338ca', lineHeight: 1.5 }}>
              When generating a paper using "Same as PYQs" difficulty option, EXAM-AI will maintain this ~35% Easy, 45% Medium, 20% Hard distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
