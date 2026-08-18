import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, demoAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('exam_ai_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) {}
    }
    return {
      id: 'u_demo_teacher',
      name: 'Dr. Tanmay Nanaware',
      email: 'teacher@exam.ai',
      role: 'teacher',
      college: 'COEP Technological University',
      university: 'SPPU',
      branch: 'Computer Engineering'
    };
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      await demoAPI.seedDemo();
    } catch (e) {
      console.warn('Demo seed init note:', e.message);
    }

    const token = localStorage.getItem('exam_ai_token');
    if (!token) {
      setDemoUser('teacher');
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('exam_ai_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Auth check error, using cached/demo user:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (role = 'teacher') => {
    if (role === 'teacher') {
      const demoTeacher = {
        id: 'u_demo_teacher',
        name: 'Dr. Tanmay Nanaware',
        email: 'teacher@exam.ai',
        role: 'teacher',
        college: 'COEP Technological University',
        university: 'SPPU',
        branch: 'Computer Engineering'
      };
      localStorage.setItem('exam_ai_token', 'demo-teacher-token');
      localStorage.setItem('exam_ai_user', JSON.stringify(demoTeacher));
      setUser(demoTeacher);
    } else {
      const demoStudent = {
        id: 'u_demo_student',
        name: 'Rahul Sharma',
        email: 'student@exam.ai',
        role: 'student',
        college: 'COEP Technological University',
        university: 'SPPU',
        branch: 'Computer Engineering',
        year: '3rd Year',
        semester: '6th Sem'
      };
      localStorage.setItem('exam_ai_token', 'demo-student-token');
      localStorage.setItem('exam_ai_user', JSON.stringify(demoStudent));
      setUser(demoStudent);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('exam_ai_token', res.data.token);
    localStorage.setItem('exam_ai_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    localStorage.setItem('exam_ai_token', res.data.token || res.data.user.id);
    localStorage.setItem('exam_ai_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('exam_ai_token');
    localStorage.removeItem('exam_ai_user');
    setDemoUser('teacher');
  };

  const switchRole = (newRole) => {
    setDemoUser(newRole);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, switchRole, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
