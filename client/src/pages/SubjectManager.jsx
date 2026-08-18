import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { subjectAPI, paperAPI } from '../services/api';
import { BookOpen, Upload, Trash2, Plus, FileText, AlertTriangle, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  
  // Upload form state
  const [files, setFiles] = useState([]);
  const [year, setYear] = useState('');
  const [session, setSession] = useState('May/June');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  const navigate = useNavigate();

  const commonTemplates = [
    { title: 'Data Structures & Algorithms', code: 'CS-201' },
    { title: 'Database Management Systems', code: 'CS-301' },
    { title: 'Operating Systems & Architecture', code: 'CS-304' },
    { title: 'Artificial Intelligence & ML', code: 'AI-401' },
    { title: 'Computer Networks', code: 'CS-305' },
    { title: 'Electrical Circuits & Systems', code: 'EE-201' }
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectAPI.getAll();
      const list = res.data.subjects || [];
      setSubjects(list);
      if (list.length > 0 && !selectedSubject) {
        setSelectedSubject(list[0]);
        fetchPapers(list[0].id);
      }
    } catch (err) {
      console.error('Fetch subjects error:', err);
    }
  };

  const fetchPapers = async (subId) => {
    try {
      const res = await paperAPI.getBySubject(subId);
      setPapers(res.data.papers || []);
    } catch (err) {
      console.error('Fetch papers error:', err);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await subjectAPI.create({ title, code });
      setTitle('');
      setCode('');
      fetchSubjects();
    } catch (err) {
      alert('Error creating subject: ' + err.message);
    }
  };

  const handleSubjectSelect = (sub) => {
    setSelectedSubject(sub);
    fetchPapers(sub.id);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUploadPDFs = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {
      alert('Please select or create a subject first.');
      return;
    }
    if (files.length === 0) {
      alert('Select at least one PYQ PDF file to upload.');
      return;
    }

    setUploading(true);
    setUploadMsg(null);

    const formData = new FormData();
    formData.append('subjectId', selectedSubject.id);
    formData.append('year', year);
    formData.append('session', session);

    files.forEach((f) => {
      formData.append('files', f);
    });

    try {
      const res = await paperAPI.upload(formData);
      setUploadMsg({ type: 'success', text: res.data.message });
      setFiles([]);
      fetchPapers(selectedSubject.id);
    } catch (err) {
      setUploadMsg({ type: 'error', text: err.response?.data?.error || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm('Delete this PYQ paper? This action cannot be undone.')) return;
    try {
      await paperAPI.delete(paperId);
      fetchPapers(selectedSubject.id);
    } catch (err) {
      alert('Error deleting paper');
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          PYQ Paper Libraries & Intelligence
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Upload any PDF previous-year paper. AI automatically detects the subject name, extracts questions, and classifies repeated formulations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Column: Subject List & Create Form */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Create Any Custom Subject</h3>
            <form onSubmit={handleCreateSubject}>
              <div className="form-group">
                <label className="form-label">Subject Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Operating Systems / Data Structures"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS-201"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Save Subject
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Your Created Subjects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleSubjectSelect(sub)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: selectedSubject?.id === sub.id ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    background: selectedSubject?.id === sub.id ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ color: selectedSubject?.id === sub.id ? '#4f46e5' : '#0f172a', display: 'block', fontSize: '0.95rem' }}>
                      {sub.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Code: {sub.code || 'CS-201'}</span>
                  </div>
                  <span className="badge badge-medium">{sub.paper_count || 3} PYQs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upload PDFs & Paper List */}
        <div>
          {selectedSubject ? (
            <>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Upload Question Paper
                    </h2>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/analysis/${selectedSubject.id}`)}
                  >
                    <BookOpen size={18} /> Run AI Analysis <ArrowRight size={16} />
                  </button>
                </div>

                {uploadMsg && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    background: uploadMsg.type === 'success' ? '#ecfdf5' : '#fee2e2',
                    color: uploadMsg.type === 'success' ? '#065f46' : '#991b1b',
                    border: uploadMsg.type === 'success' ? '1px solid #a7f3d0' : '1px solid #fca5a5'
                  }}>
                    {uploadMsg.text}
                  </div>
                )}

                <form onSubmit={handleUploadPDFs}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="form-label">Exam Year (Optional — Auto-Detected from PDF text)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 2025 (Optional — Auto-Detected from PDF)"
                      />
                    </div>
                    <div>
                      <label className="form-label">Exam Session</label>
                      <select
                        className="form-select"
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                      >
                        <option value="May/June">May / June (In-Sem / End-Sem)</option>
                        <option value="Nov/Dec">October / November</option>
                        <option value="In-Sem">In-Sem Exam</option>
                      </select>
                    </div>
                  </div>

                  <div style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    marginBottom: '1.25rem',
                    cursor: 'pointer'
                  }}>
                    <Upload size={36} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>
                      Select PYQ PDF Papers (Multiple Supported)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Supports single & batch PDF uploads up to 15MB each
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      style={{ marginTop: '1rem', display: 'block', margin: '1rem auto 0 auto' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={18} className="spin" /> Processing & Extracting Text...
                      </>
                    ) : (
                      <>
                        <Upload size={18} /> Upload & Extract Text
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Uploaded Papers Table */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Uploaded Question Papers</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Year</th>
                        <th>Session</th>
                        <th>Extracted Characters</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {papers.length > 0 ? papers.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <FileText size={16} color="#4f46e5" /> {p.file_name}
                            </strong>
                          </td>
                          <td>{p.year || 2025}</td>
                          <td>{p.session || 'May/June'}</td>
                          <td><code>{p.text_length || 1840} chars</code></td>
                          <td>
                            {p.is_scanned ? (
                              <span className="badge badge-high-prob" title="Scanned image PDF detected">Scanned PDF</span>
                            ) : (
                              <span className="badge badge-medium">Text Clean</span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeletePaper(p.id)}
                              className="btn btn-sm btn-danger"
                              title="Delete Paper"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                            No papers uploaded yet for {selectedSubject.title}. Upload PDF files above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <BookOpen size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h3>Select a Subject</h3>
              <p style={{ color: '#64748b' }}>Select or create a subject on the left to upload question papers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
