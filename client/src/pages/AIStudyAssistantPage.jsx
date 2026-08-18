import React, { useState } from 'react';
import { analyticsAPI } from '../services/api';
import { MessageSquareText, Send, Sparkles, Brain, Loader2, BookOpen } from 'lucide-react';

export default function AIStudyAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your EXAM-AI Study Assistant. Ask me to explain PYQ concepts, generate practice questions, or clarify mistakes from your tests.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Explain why Virtualization questions are marked MUST STUDY.",
    "Which topics should I study first for Cloud Computing?",
    "Give me 5 practice numerical problems on AWS S3 storage pricing.",
    "Explain my mistakes in Unit 4 Security."
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await analyticsAPI.askAIAssistant({
        prompt: query,
        subjectTitle: 'Cloud Computing'
      });

      const aiMsg = { sender: 'ai', text: res.data.answer || 'Here is your academic explanation.' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to AI service. Focus on Unit 2 virtualization concepts and 2024 PYQs.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          AI Revision Assistant & Study Tutor
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Interactive contextual AI assistant powered by OpenRouter LLM & PYQ knowledge base.
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.75rem' }}
          >
            <Sparkles size={12} color="#6366f1" /> "{p.slice(0, 40)}..."
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="card" style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              backgroundColor: m.sender === 'user' ? '#4f46e5' : '#f1f5f9',
              color: m.sender === 'user' ? '#ffffff' : '#0f172a',
              padding: '0.875rem 1.15rem',
              borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            {m.sender === 'ai' && (
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Brain size={12} /> EXAM-AI Assistant
              </div>
            )}
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={16} className="spin" /> EXAM-AI is thinking...
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="form-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question or request revision advice..."
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}
