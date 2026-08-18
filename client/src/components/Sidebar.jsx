import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Brain,
  Sparkles,
  Award,
  CheckCircle,
  BarChart3,
  MessageSquareText,
  Upload,
  BookOpen,
  HelpCircle,
  User
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const teacherNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile & History', path: '/profile', icon: User },
    { label: 'Subjects & PYQ Upload', path: '/subjects', icon: Upload },
    { label: 'PYQ Intelligence', path: '/analysis/sub_demo_cloud', icon: Brain, badge: 'AI' },
    { label: 'Paper Generator', path: '/generator', icon: Sparkles },
    { label: 'AI Prompt Box', path: '/prompt-box', icon: MessageSquareText },
    { label: 'Tests & Submissions', path: '/tests', icon: Award },
    { label: 'Student Results', path: '/evaluations/att_demo_student_01', icon: CheckCircle },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const studentNav = [
    { label: 'Student Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
    { label: 'My Profile & History', path: '/profile', icon: User },
    { label: 'PYQ Study Intelligence', path: '/student-pyq-study', icon: Brain, badge: 'MUST STUDY' },
    { label: 'Join Online Test', path: '/join-test', icon: Award, badge: 'Active' },
    { label: 'My Attempt Results', path: '/results/att_demo_student_01', icon: CheckCircle },
    { label: 'AI Revision Assistant', path: '/ai-assistant', icon: MessageSquareText, badge: 'AI' },
    { label: 'Performance Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const navItems = isTeacher ? teacherNav : studentNav;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.75rem',
      flexShrink: 0
    }}>
      <div style={{ padding: '0 0.75rem 1rem 0.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isTeacher ? 'Teacher Portal' : 'Student Portal'}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
          {user?.name || 'User Profile'}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive ? '#4f46e5' : '#475569',
                backgroundColor: isActive ? '#eef2ff' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isTeacher ? '#4f46e5' : '#0ea5e9'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  backgroundColor: item.badge === 'AI' ? '#818cf8' : '#10b981',
                  color: '#ffffff',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '12px'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem 0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <HelpCircle size={16} color="#6366f1" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>Need Assistance?</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>
          Upload PYQs, generate 30/70-mark papers, conduct online tests with AI evaluation.
        </p>
      </div>
    </aside>
  );
}
