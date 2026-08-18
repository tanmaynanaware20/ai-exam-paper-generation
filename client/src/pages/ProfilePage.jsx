import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, GraduationCap, Building, Shield, Award, BookOpen, Clock, FileText, CheckCircle2, Camera, Loader2, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [newAvatarSeed, setNewAvatarSeed] = useState(user?.name || 'AcademicUser');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileActivity();
  }, []);

  const fetchProfileActivity = async () => {
    try {
      const res = await authAPI.getProfileActivity();
      setProfileData(res.data);
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSave = async () => {
    setSaving(true);
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newAvatarSeed)}`;

    try {
      const res = await authAPI.updateProfile({
        name: profileData?.profile?.name || user?.name,
        avatar_url: newAvatarUrl
      });

      setProfileData(prev => ({
        ...prev,
        profile: { ...prev.profile, avatar_url: newAvatarUrl }
      }));

      if (setUser) {
        setUser({ ...user, avatar_url: newAvatarUrl });
      }

      setEditingAvatar(false);
    } catch (err) {
      alert('Error updating avatar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const profile = profileData?.profile || user || {
    name: 'User Profile',
    email: 'user@exam.ai',
    role: 'student',
    course: 'B.E.',
    branch: 'Computer Engineering',
    year: 'BE - Final Year',
    college: 'COEP Technological University',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ExamUser'
  };

  const testHistory = profileData?.testHistory || [
    {
      id: 'att_01',
      testCode: 'CC2026A01',
      testTitle: 'Engineering Mid-Term Assessment 1',
      subjectTitle: 'Cloud Computing & Distributed Systems',
      score: 24,
      totalMarks: 30,
      percentage: 80,
      status: 'evaluated',
      date: '2026-08-18'
    }
  ];

  const studyHistory = profileData?.studyHistory || {
    subjects: [
      { id: 'sub_demo_cloud', title: 'Cloud Computing & Distributed Systems', code: 'CS-302' },
      { id: 'sub_demo_dsa', title: 'Data Structures & Algorithms', code: 'CS-201' },
      { id: 'sub_demo_dbms', title: 'Database Management Systems', code: 'CS-301' }
    ],
    generatedPapersCount: 4
  };

  return (
    <div className="page-container">
      {/* Profile Header Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff',
        padding: '2.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Avatar Image & Edit Trigger */}
        <div style={{ position: 'relative' }}>
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`}
            alt="User Avatar"
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '4px solid #818cf8',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              objectFit: 'cover'
            }}
          />
          <button
            onClick={() => setEditingAvatar(!editingAvatar)}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Change Avatar"
          >
            <Camera size={16} />
          </button>
        </div>

        {/* User Details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
              {profile.name}
            </h1>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '12px',
              backgroundColor: profile.role === 'teacher' ? '#818cf8' : '#38bdf8',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {profile.role === 'teacher' ? 'Faculty / Professor' : 'Student'}
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#c7d2fe', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Mail size={16} /> {profile.email}
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#e0e7ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <GraduationCap size={16} color="#a5b4fc" /> <strong>Course:</strong> {profile.course || 'B.E.'} ({profile.branch || 'Computer Engineering'})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={16} color="#a5b4fc" /> <strong>Class / Year:</strong> {profile.year || 'BE - Final Year'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={16} color="#a5b4fc" /> <strong>College:</strong> {profile.college || 'COEP Technological University'}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Change Modal */}
      {editingAvatar && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
              Customize Profile Avatar
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Type any seed keyword to generate a custom SVG avatar!
            </p>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newAvatarSeed)}`}
                alt="Preview Avatar"
                style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '2px solid #818cf8' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Keyword Seed</label>
              <input
                type="text"
                className="form-input"
                value={newAvatarSeed}
                onChange={(e) => setNewAvatarSeed(e.target.value)}
                placeholder="e.g. Professor, Scholar, Alex, Tanmay"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={() => setEditingAvatar(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAvatarSave} disabled={saving}>
                {saving ? <Loader2 size={16} className="spin" /> : 'Save Avatar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Test & Score History + Study Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Test & Score History */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} color="#4f46e5" /> Test & Assessment Score History
          </h3>

          {testHistory.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Test Code</th>
                    <th style={{ padding: '0.75rem' }}>Assessment Title</th>
                    <th style={{ padding: '0.75rem' }}>Score</th>
                    <th style={{ padding: '0.75rem' }}>Percentage</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testHistory.map((t, idx) => (
                    <tr key={t.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 800, fontFamily: 'monospace', color: '#4f46e5' }}>
                        {t.testCode}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                        {t.testTitle}
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>{t.subjectTitle}</div>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 800, color: '#1e293b' }}>
                        {t.score} / {t.totalMarks}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          fontWeight: 800,
                          color: t.percentage >= 70 ? '#047857' : t.percentage >= 50 ? '#0284c7' : '#dc2626',
                          backgroundColor: t.percentage >= 70 ? '#ecfdf5' : t.percentage >= 50 ? '#e0f2fe' : '#fee2e2',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '12px'
                        }}>
                          {t.percentage}%
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={14} /> Evaluated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
              <Award size={40} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
              <p>No tests taken yet. Join a test using test code to view your evaluation history!</p>
            </div>
          )}
        </div>

        {/* Right Column: Study & PYQ History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="#0ea5e9" /> Study & PYQ Libraries
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(studyHistory.subjects || []).map(s => (
                <div key={s.id} style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{s.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Code: {s.code || 'CS-302'}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#5b21b6', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={16} color="#7c3aed" /> EXAM-AI Student Portfolio
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#6d28d9', lineHeight: 1.5, margin: 0 }}>
              All tests, PYQ study evaluations, and generated revision papers are stored securely in your EXAM-AI profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
