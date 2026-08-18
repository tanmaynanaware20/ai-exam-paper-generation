import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, UserCheck, Shield, LogOut, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const isTeacher = user?.role === 'teacher';

  return (
    <header style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff', textDecoration: 'none' }}>
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
            <div style={{ fontSize: '1.25rem', fontWeight: 800, tracking: 'tight', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              EXAM<span style={{ color: '#818cf8' }}>-AI</span>
              <span style={{
                fontSize: '0.65rem',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid rgba(165, 180, 252, 0.3)'
              }}>v2.0 PRO</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>
              PYQ Intelligence & Exam Platform
            </div>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Role Toggle Switch */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '20px',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #334155'
        }}>
          <button
            onClick={() => switchRole('teacher')}
            style={{
              background: isTeacher ? '#4f46e5' : 'transparent',
              color: isTeacher ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '16px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s'
            }}
          >
            <Shield size={14} /> Teacher Mode
          </button>
          <button
            onClick={() => switchRole('student')}
            style={{
              background: !isTeacher ? '#0ea5e9' : 'transparent',
              color: !isTeacher ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '16px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={14} /> Student Mode
          </button>
        </div>

        {/* Demo Mode Notice */}
        <button
          onClick={() => {
            navigate('/demo');
          }}
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.85rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Sparkles size={14} /> Try Live Demo
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                backgroundColor: '#1e293b',
                padding: '0.3rem 0.65rem',
                borderRadius: '20px',
                border: '1px solid #334155'
              }}
            >
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                alt="Avatar"
                style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#ffffff' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1 }}>{user.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 600 }}>My Profile</div>
              </div>
            </Link>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              title="Logout"
              style={{
                background: '#334155',
                color: '#cbd5e1',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
