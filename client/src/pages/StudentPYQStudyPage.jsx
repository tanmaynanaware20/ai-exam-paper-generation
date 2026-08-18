import React, { useState, useEffect } from 'react';
import { subjectAPI, paperAPI, analysisAPI, analyticsAPI } from '../services/api';
import { Brain, Sparkles, Filter, CheckCircle, BookOpen, Upload, Plus, FileText, Loader2, AlertCircle, ArrowRight, X } from 'lucide-react';

export default function StudentPYQStudyPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('Uploaded Examination Subject');
  const [analysisData, setAnalysisData] = useState(null);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [activeSolutionQ, setActiveSolutionQ] = useState(null);
  const [aiSolution, setAiSolution] = useState(null);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [loading, setLoading] = useState(true);

  // Student Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newSubTitle, setNewSubTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [year, setYear] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      fetchAnalysis(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAll();
      const list = res.data.subjects || [];
      setSubjects(list);
      if (list.length > 0) {
        setSelectedSubjectId(list[0].id);
      }
    } catch (err) {
      console.error('Fetch subjects error:', err);
    }
  };

  const fetchAnalysis = async (subId) => {
    setLoading(true);
    try {
      const res = await analysisAPI.getAnalysis(subId);
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

  const handleCreateAndUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Select at least one PDF question paper to upload.');
      return;
    }

    setUploading(true);
    setStatusMsg(null);

    let targetSubId = selectedSubjectId;

    try {
      // If user manually typed a new subject name
      if (newSubTitle.trim()) {
        const subRes = await subjectAPI.create({ title: newSubTitle });
        targetSubId = subRes.data.subject.id;
        fetchSubjects();
      }

      const formData = new FormData();
      if (targetSubId) formData.append('subjectId', targetSubId);
      if (year) formData.append('year', year);
      files.forEach(f => formData.append('files', f));

      const uploadRes = await paperAPI.upload(formData);
      const finalSubjectId = uploadRes.data.subjectId || targetSubId;

      // Trigger AI Analysis
      setStatusMsg({ type: 'info', text: 'Running AI PYQ Question Classification & Frequency Clustering...' });
      const anaRes = await analysisAPI.runAnalysis(finalSubjectId);

      setStatusMsg({ type: 'success', text: `AI Analysis complete! Processed ${anaRes.data.questionsCount} questions into ${anaRes.data.groupedCount} clusters.` });
      setSelectedSubjectId(finalSubjectId);
      fetchAnalysis(finalSubjectId);
      fetchSubjects();
      setFiles([]);
      setNewSubTitle('');
      setYear('');
      setTimeout(() => { setShowUploadModal(false); setStatusMsg(null); }, 2000);

    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.error || err.message || 'Upload & Analysis failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSolution = async (questionText) => {
    setActiveSolutionQ(questionText);
    setLoadingSolution(true);
    setAiSolution(null);

    try {
      const prompt = `Give a comprehensive university-grade reference answer and revision notes for this PYQ question: "${questionText}".
Format with:
1. Core Definition & Architectural Key Points
2. Step-by-Step Explanation / Derivation / Key Formula
3. Exam Tips & Key Keywords to include for full marks`;

      const res = await analyticsAPI.askAIAssistant({
        prompt,
        subjectTitle
      });

      setAiSolution(res.data.answer || 'Detailed study explanation prepared by EXAM-AI.');
    } catch (err) {
      setAiSolution('Focus on core architectural definitions, diagrams, and benefits for this question.');
    } finally {
      setLoadingSolution(false);
    }
  };

  const questions = analysisData?.groupedQuestions || [
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

  const filteredQuestions = questions.filter(q => {
    if (filterPriority === 'ALL') return true;
    return q.priority === filterPriority;
  });

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
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
          <div style={{ fontSize: '0.85rem', color: '#bae6fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Student PYQ Study & Intelligence Platform
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem' }}>
            PYQ Pattern Study & MUST STUDY Classification
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#e0f2fe', marginTop: '0.35rem', maxWidth: '650px' }}>
            Drop any subject PYQ PDF paper to automatically classify repeated questions, frequency counts, MUST STUDY tags, and generate AI model answers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn"
            style={{ background: '#ffffff', color: '#0369a1', fontWeight: 800 }}
          >
            <Upload size={18} /> + Fast Upload PYQ PDFs
          </button>
        </div>
      </div>

      {/* Subject Selection Bar & Upload Modal Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
            Subject:
          </label>
          <select
            className="form-select"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            style={{ fontWeight: 700, minWidth: '240px' }}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.code || 'CS-302'})</option>
            ))}
          </select>
        </div>

        {/* Priority Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'MUST STUDY', 'HIGH PROBABILITY', 'MEDIUM'].map(prio => (
            <button
              key={prio}
              onClick={() => setFilterPriority(prio)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: filterPriority === prio ? '2px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: filterPriority === prio ? '#e0f2fe' : '#ffffff',
                color: filterPriority === prio ? '#0369a1' : '#475569'
              }}
            >
              {prio === 'ALL' ? 'All Questions' : prio} {prio === 'MUST STUDY' ? '🔥' : prio === 'HIGH PROBABILITY' ? '⭐' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Classified Repeated Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuestions.length > 0 ? filteredQuestions.map((q, idx) => {
            let badgeClass = 'badge-low';
            if (q.priority === 'MUST STUDY') badgeClass = 'badge-must-study';
            else if (q.priority === 'HIGH PROBABILITY') badgeClass = 'badge-high-prob';
            else if (q.priority === 'MEDIUM') badgeClass = 'badge-medium';

            const isSelected = activeSolutionQ === q.canonical_question;

            return (
              <div
                key={q.id || idx}
                className="card card-hover"
                style={{
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#f0f9ff' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${badgeClass}`}>{q.priority}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Unit {q.unit || 1}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0ea5e9' }}>{q.difficulty}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
                    Repeated {q.frequency}x in PYQs
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  {q.canonical_question}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Appeared in:</span>
                    {(q.years || [2023, 2024, 2025]).map(y => (
                      <span key={y} style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                        {y} ✓
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleGenerateSolution(q.canonical_question)}
                    className="btn btn-sm btn-primary"
                    style={{ background: '#0284c7', fontSize: '0.775rem' }}
                  >
                    <Sparkles size={14} /> AI Study Answer
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h3>No Questions Found for this Filter</h3>
              <p style={{ color: '#64748b' }}>Upload PYQ PDFs for this subject to run AI question classification.</p>
            </div>
          )}
        </div>

        {/* AI Solution & Notes View Panel */}
        <div className="card" style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={20} color="#0284c7" /> AI Study Model Answer
          </h3>

          {loadingSolution ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <Loader2 size={24} className="spin" style={{ margin: '0 auto 0.5rem auto' }} />
              <div>Generating university model answer & revision notes...</div>
            </div>
          ) : aiSolution ? (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>
                Question: {activeSolutionQ}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {aiSolution}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              <BookOpen size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>
                Click <strong>"AI Study Answer"</strong> on any question card on the left to generate model reference answers and revision notes!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={22} color="#0284c7" /> Fast PYQ Upload & AI Classification
              </h3>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            {statusMsg && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: statusMsg.type === 'success' ? '#ecfdf5' : statusMsg.type === 'info' ? '#e0f2fe' : '#fee2e2',
                color: statusMsg.type === 'success' ? '#065f46' : statusMsg.type === 'info' ? '#0369a1' : '#991b1b',
                border: statusMsg.type === 'success' ? '1px solid #a7f3d0' : statusMsg.type === 'info' ? '1px solid #bae6fd' : '1px solid #fca5a5'
              }}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateAndUpload}>
              <div className="form-group">
                <label className="form-label">Subject Name (Optional — Auto-Detected if Blank)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  placeholder="e.g. Data Structures / Operating Systems (Optional)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Exam Year (Optional — Auto-Detected if Blank)</label>
                <input
                  type="number"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2025 (Optional)"
                />
              </div>

              <div style={{
                border: '2px dashed #0284c7',
                borderRadius: '12px',
                padding: '1.75rem',
                textAlign: 'center',
                backgroundColor: '#f0f9ff',
                marginBottom: '1.25rem',
                cursor: 'pointer'
              }}>
                <Upload size={36} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0369a1' }}>
                  Select PYQ PDF Papers (Single or Batch)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Drop single or multiple PDF question papers for AI question extraction
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  style={{ marginTop: '0.75rem', display: 'block', margin: '0.75rem auto 0 auto' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)} disabled={uploading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#0284c7' }} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="spin" /> Processing & Classifying with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Fast Upload & Classify
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
