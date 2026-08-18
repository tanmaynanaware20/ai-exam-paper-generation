import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testAPI } from '../services/api';
import { Award, Copy, Check, Trash2, Users, ArrowRight, ExternalLink } from 'lucide-react';

export default function TestManagerPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await testAPI.getAll();
      setTests(res.data.tests || []);
    } catch (err) {
      console.error('Fetch tests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Delete this test and associated student submissions?')) return;
    try {
      await testAPI.delete(testId);
      fetchTests();
    } catch (err) {
      alert('Error deleting test');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
            Online Tests & Student Submissions
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Manage active student tests, share test codes, and review AI-evaluated answer scripts.
          </p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>Active Examination Tests</h3>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test Code</th>
                <th>Test Title</th>
                <th>Subject</th>
                <th>Duration</th>
                <th>Total Marks</th>
                <th>Submissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.length > 0 ? tests.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '1rem', color: '#4f46e5', fontFamily: 'JetBrains Mono, monospace' }}>
                        {t.test_code}
                      </strong>
                      <button
                        onClick={() => handleCopyCode(t.test_code)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.2rem 0.4rem' }}
                        title="Copy Test Code"
                      >
                        {copiedCode === t.test_code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{t.title}</strong>
                  </td>
                  <td>{t.subject_title || 'Cloud Computing'}</td>
                  <td>{t.duration_minutes || 30} Mins</td>
                  <td>{t.total_marks || 30} Marks</td>
                  <td>
                    <span className="badge badge-must-study">{t.attempt_count || 1} Submitted</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/evaluations/att_demo_student_01`} className="btn btn-sm btn-primary">
                        <Users size={14} /> Submissions
                      </Link>
                      <button onClick={() => handleDeleteTest(t.id)} className="btn btn-sm btn-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                    No active tests created yet. Generate a paper and click "Create Student Test".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
