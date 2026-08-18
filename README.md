# 🎓 EXAM-AI — AI-Powered Examination & PYQ Intelligence Platform

> **EXAM-AI** is a comprehensive, production-ready AI examination suite designed for engineering colleges, universities, professors, and students. It processes Previous Year Question Papers (PYQs), extracts question intelligence, generates 30 & 70-mark university question papers, conducts online student tests, and evaluates subjective answers using OpenRouter LLMs.

---

## 🌐 Live Demo

🚀 **Live Frontend:**  
https://ai-exam-paper-generation.vercel.app/

⚙️ **Backend / Render:**  
https://dashboard.render.com/web/srv-da27o1jm8hqs73bmo9qg

📦 **GitHub Repository:**  
https://github.com/tanmaynanaware20/ai-exam-paper-generation

---

## 🌟 Core Product Features

### 1. 🚀 Product Showcase Landing Page (`/`)

- Full-screen product showcase displaying all platform capabilities.
- Direct **Log In** and **Register / Sign Up** CTAs for seamless user onboarding.

### 2. 🔐 Authentication & Security (`/signup`, `/login`)

- **Role Selection:** Toggle between **Teacher / Professor** and **Student** registration.
- **Teacher Secret Passkey:** Faculty accounts require secret passkey verification (`TEACHER2026`).
- **Academic Fields:** Degree, Stream/Branch, Class/Year, and College/University.
- Supported degrees:
  - `B.E.`
  - `B.Tech`
  - `B.C.S.`
  - `M.E.`
  - `M.Tech`
  - `M.C.A.`

### 3. 👤 User Profile & Score History (`/profile`)

- Displays user profile details.
- Interactive SVG avatar generator.
- Test attempt history.
- Test codes such as `CC2026A01`.
- Score tracking such as `24/30 - 80%`.
- AI evaluation status.

### 4. 📁 PYQ Upload & Auto-Detection (`/subjects`)

- Upload single or batch PDF Previous Year Question Papers.
- Maximum PDF size: **15MB**.
- OpenRouter AI analyzes uploaded papers.
- Automatically detects:
  - Subject/course title
  - Examination year
  - Examination session
  - May/June examinations
  - November/December examinations

### 5. 🧠 PYQ Intelligence & MUST STUDY Clustering (`/student-pyq-study`)

- Groups reworded question variants across previous papers.
- Calculates historical frequency:
  - **4x**
  - **3x**
  - **2x**
- Identifies high-priority concepts.
- Tags important concepts as **MUST STUDY**.
- Sanitizes historical year data.
- Prevents future years such as `2026` from appearing as previous-paper appearances.

### 6. 📝 30 & 70-Mark Question Paper Generator (`/generator`)

- Generates university-pattern model question papers.
- Supports **30-mark** and **70-mark** papers.
- Generates OR choices such as:
  - `Q1 OR Q2`
- Performs mathematical mark-balance validation.
- Ensures sub-question marks correctly add up to the required total.

### 7. ⏱️ Online Test Engine (`/tests`, `/take-test/:code`)

- Teachers can create and launch online assessments.
- Custom test codes such as `CC2026A01`.
- Students can take tests online.
- Live countdown timer.
- Question navigation.
- Automatic answer saving/autosave.

### 8. 🤖 AI Subjective Answer Evaluation (`/evaluations/:id`)

- Uses OpenRouter LLMs to evaluate subjective answers.
- Compares student answers against reference concepts.
- Provides:
  - Awarded marks
  - Correct points
  - Missing points
  - AI evaluation feedback
- Teachers can override AI-awarded marks when required.

---

# 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| 🎨 Frontend | React 18, Vite |
| 🧭 Routing | React Router DOM |
| 🎯 Icons | Lucide Icons |
| 📐 Mathematics | KaTeX |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | PostgreSQL / SQLite |
| 🤖 AI | OpenRouter API |
| 🧠 AI Models | `openai/gpt-3.5-turbo`, `anthropic/claude-3-haiku` |
| 🌐 Frontend Deployment | Vercel |
| 🚀 Backend Deployment | Render |

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      EXAM-AI         │
                    │    Web Platform      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
       ┌──────▼──────┐                   ┌──────▼──────┐
       │   Student   │                   │   Teacher   │
       └──────┬──────┘                   └──────┬──────┘
              │                                 │
              └────────────────┬────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    React + Vite     │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │ REST API
                    ┌──────────▼──────────┐
                    │  Node.js + Express  │
                    │      Backend        │
                    └──────┬───────┬──────┘
                           │       │
                ┌──────────▼─┐   ┌─▼──────────────┐
                │ PostgreSQL │   │ SQLite Embedded │
                │  Database  │   │  Zero-Config   │
                └────────────┘   └────────────────┘
                           │
                    ┌──────▼──────┐
                    │ OpenRouter  │
                    │     AI      │
                    └──────┬──────┘
                           │
              ┌────────────▼────────────┐
              │ PYQ Analysis            │
              │ Paper Generation        │
              │ Answer Evaluation       │
              └─────────────────────────┘
