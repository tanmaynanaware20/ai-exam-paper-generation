# 🎓 EXAM-AI — AI-Powered PYQ Intelligence & Examination Platform

> An end-to-end AI platform for Engineering Colleges & Universities to analyze Previous Year Question Papers (PYQs), generate 30 & 70-mark question papers, conduct online student tests, and evaluate subjective answers with OpenRouter LLMs.

---

## ✨ Key Features

1. **Product Showcase Landing Page (`/`)**:
   - Comprehensive overview of all product capabilities with direct Log In & Sign Up CTAs.
2. **Step 1 Authentication & Teacher Passkey Security (`/signup`, `/login`)**:
   - Role-based signup toggle (Teacher vs Student).
   - Secret Passkey verification for faculty (`TEACHER2026`).
   - Academic details dropdowns: Course (`B.E.`, `B.Tech`, `B.C.S.`, `M.E.`, `M.Tech`, `M.C.A.`), Stream/Branch, Class/Year, and College.
3. **User Profile & Score History (`/profile`)**:
   - User profile info card with SVG avatar customization.
   - Comprehensive score history table for test attempts, test codes (e.g. `CC2026A01`), percentage badges, and evaluation status.
4. **Dynamic PYQ PDF Upload & Auto-Detection (`/subjects`)**:
   - Upload single or batch PDF question papers.
   - OpenRouter AI auto-extracts Subject Title and Exam Year directly from PDF header text.
5. **PYQ Intelligence & MUST STUDY Clustering (`/student-pyq-study`)**:
   - Identifies question variants, calculates historical frequencies (4x, 3x, 2x), tags MUST STUDY questions, and sanitizes historical years.
6. **30 & 70-Mark Question Paper Generator (`/generator`)**:
   - Generates university-pattern model question papers with OR choices (Q1 OR Q2).
   - Enforces strict mark balance mathematical validation.
7. **Online Test Engine with Live Countdown Timer (`/tests`)**:
   - Launch online assessments using custom test codes (e.g. `CC2026A01`).
   - Student test interface with live timer, question navigation, and autosave.
8. **AI Subjective Answer Evaluation (`/evaluations/:id`)**:
   - OpenRouter LLM evaluates student subjective answers against reference concepts.
   - Calculates awarded marks, missing points, concept feedback, and supports teacher mark overrides.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Lucide Icons, KaTeX (LaTeX math rendering).
- **Backend**: Node.js, Express.js, PostgreSQL / SQLite.
- **AI Engine**: OpenRouter API (`openai/gpt-3.5-turbo`, `anthropic/claude-3-haiku`).

---

## 🚀 Deployment Guide

### 🌐 1. Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository: `tanmaynanaware20/ai-exam-paper-generation`.
3. Set **Root Directory**: `client`.
4. Build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will handle single-page application (SPA) routing via `client/vercel.json`.

---

### ⚡ 2. Deploy Backend on Render
1. Go to [Render](https://render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `tanmaynanaware20/ai-exam-paper-generation`.
3. Set **Root Directory**: `server`.
4. Build & Run settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables in Render settings:
   - `OPENROUTER_API_KEY`: `your_openrouter_api_key_here`
   - `PORT`: `5000`
   - `DATABASE_URL`: *(Your PostgreSQL database connection string)*
6. Click **Deploy Web Service**.

---

## 💻 Local Development Setup

### 1. Backend Server
```bash
cd server
npm install
node server.js
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend App
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🔑 Demo Teacher Credentials & Passkey
- **Teacher Secret Passkey**: `TEACHER2026`
- **Demo Test Code**: `CC2026A01`

---

© 2026 EXAM-AI Platform.
