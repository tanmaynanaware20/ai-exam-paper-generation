-- EXAM-AI Database Schema (PostgreSQL Compatible)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile_number TEXT,
  college TEXT,
  university TEXT,
  branch TEXT,
  year TEXT,
  semester TEXT,
  role TEXT CHECK (role IN ('teacher', 'student')) NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS papers (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  year INTEGER,
  session TEXT,
  raw_text TEXT,
  parsed_data TEXT,
  is_scanned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  paper_id TEXT,
  subject_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  unit INTEGER,
  marks INTEGER DEFAULT 5,
  question_type TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  priority TEXT CHECK (priority IN ('MUST STUDY', 'HIGH PROBABILITY', 'MEDIUM', 'LOW')),
  frequency INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_groups (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  canonical_question TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM',
  frequency INTEGER DEFAULT 1,
  years_vector TEXT,
  unit INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generated_papers (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  total_marks INTEGER NOT NULL,
  difficulty TEXT,
  units_json TEXT,
  pattern TEXT,
  questions_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tests (
  id TEXT PRIMARY KEY,
  generated_paper_id TEXT,
  subject_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  test_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  total_marks INTEGER DEFAULT 30,
  start_date TEXT,
  end_date TEXT,
  max_attempts INTEGER DEFAULT 1,
  questions_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_attempts (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  test_code TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  score REAL DEFAULT 0,
  total_marks INTEGER NOT NULL,
  percentage REAL DEFAULT 0,
  status TEXT CHECK (status IN ('in_progress', 'submitted', 'evaluated')) DEFAULT 'submitted',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  feedback_summary TEXT
);

CREATE TABLE IF NOT EXISTS student_answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  student_answer TEXT,
  reference_answer TEXT,
  awarded_marks REAL DEFAULT 0,
  max_marks REAL DEFAULT 5,
  feedback TEXT,
  concept_analysis TEXT,
  is_evaluated BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  teacher_override BOOLEAN DEFAULT FALSE,
  evaluation_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
