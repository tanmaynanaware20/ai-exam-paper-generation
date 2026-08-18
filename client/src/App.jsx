import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SubjectManager from './pages/SubjectManager';
import PYQAnalysisPage from './pages/PYQAnalysisPage';
import PaperGeneratorPage from './pages/PaperGeneratorPage';
import GeneratedPaperEditorPage from './pages/GeneratedPaperEditorPage';
import TestManagerPage from './pages/TestManagerPage';
import StudentTestPage from './pages/StudentTestPage';
import StudentResultPage from './pages/StudentResultPage';
import TeacherEvaluationPage from './pages/TeacherEvaluationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIStudyAssistantPage from './pages/AIStudyAssistantPage';
import StudentPYQStudyPage from './pages/StudentPYQStudyPage';
import ProfilePage from './pages/ProfilePage';
import AIPromptBoxModal from './components/AIPromptBoxModal';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 65px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Auth Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<AppLayout><TeacherDashboard /></AppLayout>} />
          <Route path="/student-dashboard" element={<AppLayout><StudentDashboard /></AppLayout>} />

          {/* Core Modules */}
          <Route path="/subjects" element={<AppLayout><SubjectManager /></AppLayout>} />
          <Route path="/analysis/:subjectId" element={<AppLayout><PYQAnalysisPage /></AppLayout>} />
          <Route path="/generator" element={<AppLayout><PaperGeneratorPage /></AppLayout>} />
          <Route path="/generator/editor/:id" element={<AppLayout><GeneratedPaperEditorPage /></AppLayout>} />
          <Route path="/prompt-box" element={<AppLayout><div className="page-container"><AIPromptBoxModal /></div></AppLayout>} />
          
          <Route path="/tests" element={<AppLayout><TestManagerPage /></AppLayout>} />
          <Route path="/join-test" element={<AppLayout><StudentDashboard /></AppLayout>} />
          <Route path="/take-test/:code" element={<StudentTestPage />} />
          <Route path="/results/:id" element={<AppLayout><StudentResultPage /></AppLayout>} />
          <Route path="/evaluations/:id" element={<AppLayout><TeacherEvaluationPage /></AppLayout>} />

          <Route path="/analytics" element={<AppLayout><AnalyticsPage /></AppLayout>} />
          <Route path="/ai-assistant" element={<AppLayout><AIStudyAssistantPage /></AppLayout>} />
          <Route path="/student-pyq-study" element={<AppLayout><StudentPYQStudyPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />

          {/* Demo Shortcut */}
          <Route path="/demo" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
