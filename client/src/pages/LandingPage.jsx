import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Sparkles, Upload, FileText, CheckCircle, BarChart3, ArrowRight, ShieldCheck, Zap, Users, LogIn, UserPlus, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const { user, setDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleTryDemo = (role = 'teacher') => {
    setDemoUser(role);
    if (role === 'teacher') {
      navigate('/dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Header Bar */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              EXAM<span style={{ color: '#818cf8' }}>-AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
              AI Examination Platform
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {user ? (
            <Link
              to={user.role === 'teacher' ? '/dashboard' : '/student-dashboard'}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', fontWeight: 800 }}
            >
              Go to Main Portal Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  borderRadius: '10px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogIn size={16} /> Log In
              </Link>
              <Link
                to="/signup"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
                }}
              >
                <UserPlus size={16} /> Register / Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section style={{
        padding: '4.5rem 1.5rem 3.5rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          color: '#a5b4fc',
          padding: '0.4rem 1.15rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 800,
          border: '1px solid rgba(165, 180, 252, 0.2)',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> Production-Ready AI Examination Platform for Colleges & Universities
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          color: '#ffffff'
        }}>
          All-in-One AI PYQ Analyzer, Question Paper Generator <br />
          <span style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            & Student Answer Evaluation Platform
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: '780px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          EXAM-AI allows teachers and students to upload previous-year question papers, automatically analyze repeated questions, generate university 30/70-mark question papers, conduct online tests with live timers, and grade student subjective answers with AI.
        </p>

        {/* Action Choice Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#fff',
              borderRadius: '12px',
              padding: '0.95rem 2.25rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)'
            }}
          >
            <UserPlus size={20} /> Create Free Account
          </Link>

          <Link
            to="/login"
            style={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '0.95rem 2.25rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <LogIn size={20} /> Login to Portal
          </Link>

          <button
            onClick={() => handleTryDemo('teacher')}
            style={{
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              color: '#f472b6',
              border: '1px solid rgba(244, 114, 182, 0.3)',
              borderRadius: '12px',
              padding: '0.95rem 1.75rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={18} /> Instant 1-Click Demo
          </button>
        </div>

        {/* Trust Badges */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: '#64748b', fontSize: '0.875rem' }}>
          <span>✓ Engineering Colleges (B.E. / B.Tech / M.E.)</span>
          <span>✓ Computer Science & IT (B.C.S. / M.C.A.)</span>
          <span>✓ 30 & 70 Mark University Papers</span>
          <span>✓ Subject-Agnostic AI Engine</span>
        </div>
      </section>

      {/* Complete Product Features Showcase */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Complete Product Capabilities
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '3rem' }}>
          Everything required for university exam creation, PYQ pattern analysis, and student evaluation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {/* Feature 1 */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ background: '#312e81', color: '#a5b4fc', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Upload size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>1. Dynamic Subject & PYQ PDF Upload</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Upload previous-year question papers (PDFs). AI automatically reads PDF header text to detect course subject titles and exam years.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ background: '#312e81', color: '#a5b4fc', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>2. PYQ Pattern & MUST STUDY Intelligence</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
              AI groups reworded question variants, computes historical frequency counts (4x, 3x, 2x), and tags MUST STUDY concepts.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ background: '#312e81', color: '#a5b4fc', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>3. 30 & 70-Mark Question Paper Generator</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Generate complete university-pattern papers with OR options (Q1 OR Q2). Includes strict mark balance validation and LaTeX math support.
            </p>
          </div>

          {/* Feature 4 */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ background: '#312e81', color: '#a5b4fc', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>4. Online Test Engine with Live Timer</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Teachers launch tests with custom test codes (e.g. CC2026A01). Students take tests with countdown timers, question navigation, and autosave.
            </p>
          </div>

          {/* Feature 5 */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ background: '#312e81', color: '#a5b4fc', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>5. AI Subjective Answer Evaluation</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
              OpenRouter LLM grades student subjective answers against reference concepts, calculating scores, highlighting missing points, and supporting teacher override.
            </p>
          </div>

          {/* Feature 6 */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ background: '#312e81', color: '#a5b4fc', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>6. Student Study Engine & AI Model Answers</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Students browse repeated PYQ questions, view historical paper appearances, and generate university-grade AI study explanations.
            </p>
          </div>
        </div>
      </section>

      {/* Portal Role Comparison */}
      <section style={{ backgroundColor: '#1e293b', borderTop: '1px solid #334155', borderBottom: '1px solid #334155', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>
            Designed Specifically for Teachers & Students
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Teacher Box */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '2rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontWeight: 800, marginBottom: '1rem', fontSize: '1.1rem' }}>
                <ShieldCheck size={22} /> For Teachers / Professors / Admins
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <li>✓ Teacher Secret Passkey Security (`TEACHER2026`)</li>
                <li>✓ Upload previous-year question papers (PDFs)</li>
                <li>✓ Generate 30 & 70-mark university question papers</li>
                <li>✓ Natural language paper prompts ("Ask EXAM-AI")</li>
                <li>✓ Conduct online student tests & review submissions</li>
                <li>✓ Teacher override for student answer marks</li>
              </ul>
              <Link to="/signup" style={{ marginTop: '1.5rem', display: 'inline-block', color: '#818cf8', fontWeight: 800, textDecoration: 'none' }}>
                Register as Teacher →
              </Link>
            </div>

            {/* Student Box */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '16px', padding: '2rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, marginBottom: '1rem', fontSize: '1.1rem' }}>
                <Users size={22} /> For Students & Candidates
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <li>✓ Free student profile registration</li>
                <li>✓ Fast PYQ upload & question classification</li>
                <li>✓ Filter MUST STUDY & HIGH PROBABILITY questions</li>
                <li>✓ Generate AI reference answers & study notes</li>
                <li>✓ Join online tests with test codes (e.g. `CC2026A01`)</li>
                <li>✓ View score history & weak topic feedback</li>
              </ul>
              <Link to="/signup" style={{ marginTop: '1.5rem', display: 'inline-block', color: '#38bdf8', fontWeight: 800, textDecoration: 'none' }}>
                Register as Student →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
          Ready to experience EXAM-AI?
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/login" className="btn" style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            Register Now
          </Link>
        </div>
        <p style={{ fontSize: '0.85rem' }}>© 2026 EXAM-AI — AI-Powered Examination Platform for Engineering Colleges & Universities.</p>
      </footer>
    </div>
  );
}
