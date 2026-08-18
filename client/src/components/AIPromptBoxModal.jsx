import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatorAPI } from '../services/api';
import { Sparkles, MessageSquare, AlertTriangle, CheckCircle, ArrowRight, Loader2, BookOpen } from 'lucide-react';

export default function AIPromptBoxModal({ subjectId = 'sub_demo_cloud', onClose }) {
  const [promptText, setPromptText] = useState('');
  const [totalMarks, setTotalMarks] = useState(30);
  const [difficulty, setDifficulty] = useState('Same as PYQs');
  const [selectedUnits, setSelectedUnits] = useState([1, 2, 3, 4]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const presetPrompts = [
    "Create 10 medium difficulty questions from Unit 2 based on previous papers. Include 2 numericals.",
    "Create a 30-mark test matching university 2024 and 2025 exam patterns.",
    "Give me 5 difficult questions focused only on repeated MUST STUDY topics.",
    "Generate a balanced revision paper from Unit 1 and Unit 3 for Data Structures / Operating Systems."
  ];

  const handleUnitToggle = (u) => {
    if (selectedUnits.includes(u)) {
      setSelectedUnits(selectedUnits.filter(item => item !== u));
    } else {
      setSelectedUnits([...selectedUnits, u]);
    }
  };

  const handleGenerate = async () => {
    if (!promptText.trim()) {
      setErrorMsg('Please write an instruction or click a sample prompt template below.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await generatorAPI.generatePaper({
        subjectId,
        totalMarks: Number(totalMarks),
        difficulty,
        selectedUnits,
        customPrompt: promptText,
        pattern: 'SPPU University Pattern'
      });

      if (res.data.paper) {
        if (onClose) onClose();
        navigate(`/generator/editor/${res.data.generatedPaperId}`);
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to generate paper with AI.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.75rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
            padding: '0.6rem',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Ask EXAM-AI <span style={{ fontSize: '0.75rem', color: '#6366f1', background: '#eef2ff', padding: '0.2rem 0.5rem', borderRadius: '12px', marginLeft: '0.4rem' }}>Grounded AI</span>
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              Type natural-language instructions. AI uses your uploaded PYQs as primary knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Prompts */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Sample Prompts (Click to Use)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {presetPrompts.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPromptText(preset)}
              style={{
                backgroundColor: promptText === preset ? '#eef2ff' : '#ffffff',
                color: promptText === preset ? '#4f46e5' : '#334155',
                border: promptText === preset ? '1px solid #818cf8' : '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              "{preset.slice(0, 45)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder='e.g., "Create a 30-mark medium difficulty test from Unit 2 based on previous papers. Include 2 numerical problems."'
          style={{
            width: '100%',
            minHeight: '110px',
            padding: '0.875rem',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.925rem',
            color: '#0f172a',
            outline: 'none',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        />
      </div>

      {/* Control Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Target Marks
          </label>
          <select
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          >
            <option value={30}>30 Marks (In-Sem)</option>
            <option value={70}>70 Marks (End-Sem)</option>
            <option value={50}>50 Marks (Mid-Term)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          >
            <option value="Same as PYQs">Same as PYQs</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
            Target Units
          </label>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[1, 2, 3, 4].map(u => (
              <button
                key={u}
                type="button"
                onClick={() => handleUnitToggle(u)}
                style={{
                  flex: 1,
                  padding: '0.4rem 0',
                  borderRadius: '6px',
                  border: selectedUnits.includes(u) ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                  background: selectedUnits.includes(u) ? '#4f46e5' : '#fff',
                  color: selectedUnits.includes(u) ? '#fff' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                U{u}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <AlertTriangle size={18} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {onClose && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleGenerate}
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Analyzing PYQs & Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Model Paper
            </>
          )}
        </button>
      </div>
    </div>
  );
}
