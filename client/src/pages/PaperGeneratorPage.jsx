import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subjectAPI, generatorAPI } from '../services/api';
import { Sparkles, MessageSquareText, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import AIPromptBoxModal from '../components/AIPromptBoxModal';

export default function PaperGeneratorPage() {
  const [searchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || 'sub_demo_cloud';

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [marksOption, setMarksOption] = useState(30); // 30 or 70
  const [difficulty, setDifficulty] = useState('Same as PYQs');
  const [selectedUnits, setSelectedUnits] = useState([1, 2, 3, 4]);
  const [pattern, setPattern] = useState('SPPU University In-Sem Pattern');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAll();
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error('Fetch subjects error:', err);
    }
  };

  const handleUnitToggle = (u) => {
    if (selectedUnits.includes(u)) {
      setSelectedUnits(selectedUnits.filter(x => x !== u));
    } else {
      setSelectedUnits([...selectedUnits, u]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await generatorAPI.generatePaper({
        subjectId: selectedSubjectId,
        totalMarks: Number(marksOption),
        difficulty,
        selectedUnits,
        customPrompt,
        pattern
      });

      if (res.data.paper) {
        navigate(`/generator/editor/${res.data.generatedPaperId}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to generate paper.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          AI Model Question Paper Generator
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Generate 30 & 70-mark university question papers using uploaded PYQs as primary knowledge base.
        </p>
      </div>

      {/* Embedded AI Prompt Box */}
      <div style={{ marginBottom: '2rem' }}>
        <AIPromptBoxModal subjectId={selectedSubjectId} />
      </div>

      <div className="card" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
          Structured Paper Generation Options
        </h2>

        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.875rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleGenerate}>
          {/* Select Subject */}
          <div className="form-group">
            <label className="form-label">Select Subject</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.code || 'CS-302'})</option>
              ))}
            </select>
          </div>

          {/* Marks Selection */}
          <div className="form-group">
            <label className="form-label">Maximum Total Marks</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setMarksOption(30)}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: marksOption === 30 ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: marksOption === 30 ? '#eef2ff' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: marksOption === 30 ? '#4f46e5' : '#0f172a' }}>
                  30 Marks Paper
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  In-Sem Exam Format | 60 Mins | Q1/Q2 (OR) & Q3/Q4 (OR)
                </div>
              </div>

              <div
                onClick={() => setMarksOption(70)}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: marksOption === 70 ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: marksOption === 70 ? '#eef2ff' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: marksOption === 70 ? '#4f46e5' : '#0f172a' }}>
                  70 Marks Paper
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  End-Sem Exam Format | 180 Mins | 6 Units Full Coverage
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="form-group">
            <label className="form-label">Target Difficulty Distribution</label>
            <select
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Same as PYQs">Same as PYQs (Historical ~35% Easy, 45% Med, 20% Hard)</option>
              <option value="Easy">Easy (Focus on basic definitions & theory)</option>
              <option value="Medium">Medium (Balanced standard university level)</option>
              <option value="Hard">Hard (Includes complex numericals & architectural derivations)</option>
              <option value="Mixed">Mixed Difficulty</option>
            </select>
          </div>

          {/* Selected Units */}
          <div className="form-group">
            <label className="form-label">Select Units to Include</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {[1, 2, 3, 4].map(u => (
                <div
                  key={u}
                  onClick={() => handleUnitToggle(u)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 700,
                    border: selectedUnits.includes(u) ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                    background: selectedUnits.includes(u) ? '#4f46e5' : '#ffffff',
                    color: selectedUnits.includes(u) ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Unit {u}
                </div>
              ))}
            </div>
          </div>

          {/* University Pattern */}
          <div className="form-group">
            <label className="form-label">Exam Pattern & Style</label>
            <input
              type="text"
              className="form-input"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="SPPU University Pattern"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spin" /> Generating Paper & Balancing Marks...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Model Question Paper ({marksOption} Marks)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
