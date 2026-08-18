import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, User, Mail, Lock, Key, Building, GraduationCap, Shield, UserCheck, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    passkey: '',
    course: 'B.E.',
    branch: 'Computer Engineering',
    year: 'BE - Final Year',
    college: 'COEP Technological University',
    university: 'SPPU'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const courseOptions = [
    'B.E. (Bachelor of Engineering)',
    'B.Tech (Bachelor of Technology)',
    'B.C.S. (Bachelor of Computer Science)',
    'B.Sc (Bachelor of Science)',
    'M.E. (Master of Engineering)',
    'M.Tech (Master of Technology)',
    'M.Sc (Master of Science)',
    'M.C.A. (Master of Computer Applications)',
    'Ph.D. / Research'
  ];

  const streamOptions = [
    'Computer Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Telecommunication (E&TC)',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Robotics & Automation',
    'Chemical / Biomedical Engineering'
  ];

  const classOptions = [
    'FE - First Year',
    'SE - Second Year',
    'TE - Third Year',
    'BE - Final Year',
    'Master Degree (ME / MTech / MCA)',
    'Faculty / Professor'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (formData.role === 'teacher' && !formData.passkey.trim()) {
      setErrorMsg('Teacher Secret Passkey is required to register as a Teacher (Hint: TEACHER2026).');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      if (formData.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            padding: '0.6rem',
            borderRadius: '12px',
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            <Brain size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Register on EXAM-AI
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Academic registration for Teachers & Students
          </p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #fca5a5' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selection Toggle */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Select Account Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: formData.role === 'teacher' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: formData.role === 'teacher' ? '#eef2ff' : '#ffffff',
                  color: formData.role === 'teacher' ? '#4f46e5' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Shield size={18} /> Teacher / Professor
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: formData.role === 'student' ? '2px solid #0ea5e9' : '1px solid #cbd5e1',
                  background: formData.role === 'student' ? '#e0f2fe' : '#ffffff',
                  color: formData.role === 'student' ? '#0ea5e9' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <UserCheck size={18} /> Student
              </button>
            </div>
          </div>

          {/* Teacher Passkey Section if Teacher Selected */}
          {formData.role === 'teacher' && (
            <div className="form-group" style={{ backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: '#5b21b6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Key size={16} /> Teacher Secret Passkey (Required for Teacher Account)
              </label>
              <input
                type="password"
                name="passkey"
                className="form-input"
                value={formData.passkey}
                onChange={handleChange}
                placeholder="Enter Teacher Passkey (Hint: TEACHER2026)"
                style={{ border: '1px solid #c4b5fd', fontWeight: 700 }}
                required={formData.role === 'teacher'}
              />
              <div style={{ fontSize: '0.75rem', color: '#6d28d9', marginTop: '0.35rem', fontWeight: 600 }}>
                💡 Teacher Passkey ensures verified faculty access. Default key: <strong>TEACHER2026</strong>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="e.g. Dr. Tanmay Nanaware" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="name@college.edu" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} placeholder="Create secure password" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Degree / Course</label>
              <select name="course" className="form-select" value={formData.course} onChange={handleChange}>
                {courseOptions.map((c, i) => <option key={i} value={c.split(' ')[0]}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Branch / Stream</label>
              <select name="branch" className="form-select" value={formData.branch} onChange={handleChange}>
                {streamOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Class / Year</label>
              <select name="year" className="form-select" value={formData.year} onChange={handleChange}>
                {classOptions.map((cl, i) => <option key={i} value={cl}>{cl}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">College / Institute Name</label>
              <input type="text" name="college" className="form-input" value={formData.college} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Creating Profile...' : 'Complete Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}
