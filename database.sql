CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255)
);

CREATE TABLE generated_papers (
  id SERIAL PRIMARY KEY,
  prompt TEXT,
  generated_text TEXT
);

CREATE TABLE old_papers (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100),
  paper_text TEXT
);

CREATE TABLE syllabus (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100),
  unit_name TEXT
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100),
  question_text TEXT
);