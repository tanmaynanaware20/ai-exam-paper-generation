import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, Phone, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'mobile'
  const [email, setEmail] = useState('teacher@exam.ai');
  const [password, setPassword] = useState('password123');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await login(email, password);
      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMsg('Enter valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setErrorMsg('');
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length !== 6) {
      setErrorMsg('Enter valid OTP (Use demo OTP: 123456)');
      return;
    }
    setDemoUser('student');
    navigate('/student-dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            padding: '0.75rem',
            borderRadius: '14px',
            color: '#fff',
            marginBottom: '0.75rem'
          }}>
            <Brain size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Welcome to EXAM-AI
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Sign in to manage PYQs, papers & student tests
          </p>
        </div>

        {/* Tab Switch */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          padding: '0.25rem',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: authMethod === 'email' ? '#ffffff' : 'transparent',
              color: authMethod === 'email' ? '#4f46e5' : '#64748b',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: authMethod === 'email' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Email Login
          </button>
          <button
            onClick={() => { setAuthMethod('mobile'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: authMethod === 'mobile' ? '#ffffff' : 'transparent',
              color: authMethod === 'mobile' ? '#0ea5e9' : '#64748b',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: authMethod === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Mobile OTP Login
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.825rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {authMethod === 'email' ? (
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@exam.ai"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOTP}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: '#0ea5e9' }}>
                  Send OTP SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  OTP sent to <strong>{mobileNumber}</strong>. (Demo OTP: <strong>123456</strong>)
                </div>
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    className="form-input"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                  Verify OTP & Login
                </button>
              </form>
            )}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 700 }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
}
