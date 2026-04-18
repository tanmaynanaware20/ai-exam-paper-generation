# ExamGen AI — Frontend

Angular 17 frontend for the ExamGen AI automatic exam paper generator.

---

## Tech Stack
- Angular 17 (Standalone Components)
- TypeScript
- SCSS
- Angular Router
- HttpClient

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Backend URL

Open `src/app/services/api.service.ts` and update the base URL:
```typescript
private baseUrl = 'http://localhost:3000/api'; // ← your backend URL here
```

### 3. Run the app
```bash
npm start
```

App runs at: http://localhost:4200

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/dashboard` | DashboardComponent | Overview & quick navigation |
| `/generate` | GenerateComponent | Generate AI exam paper |
| `/history` | HistoryComponent | View/delete past papers |
| `/upload-paper` | UploadPaperComponent | Upload previous year papers |
| `/syllabus` | SyllabusComponent | Upload syllabus & generate |

---

## API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate/generate-create` | Generate exam paper |
| POST | `/api/pdf/pdf-create` | Export to PDF (returns blob) |
| GET | `/api/history-list` | List all generated papers |
| DELETE | `/api/history/:id` | Delete a history record |
| POST | `/api/paper/paper-create` | Upload old paper (FormData) |
| GET | `/api/paper/paper-list` | List uploaded papers |
| POST | `/api/syllabus-create` | Upload & process syllabus |

### Generate Request Body
```json
{
  "prompt": "DBMS",
  "difficulty": "medium",
  "marks": 30
}
```

### PDF Request Body
```json
{
  "text": "...generated text..."
}
```

### Upload Paper (FormData)
```
file: <File>
subject: "Mathematics"
```

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/         ← Sidebar navigation
│   │   ├── dashboard/      ← Home dashboard
│   │   ├── generate/       ← Generate paper page
│   │   ├── history/        ← History table + view modal
│   │   ├── upload-paper/   ← Upload old papers
│   │   └── syllabus/       ← Upload syllabus
│   ├── services/
│   │   └── api.service.ts  ← All HTTP calls
│   ├── app.component.ts    ← Root shell (sidebar + router-outlet)
│   ├── app.config.ts       ← Angular providers
│   └── app.routes.ts       ← Route definitions
├── styles.scss             ← Global design system
└── index.html
```

---

## Design System

Dark academic theme with:
- **Fonts**: Syne (display) + DM Sans (body)
- **Colors**: Deep navy backgrounds, blue/teal/amber accents
- **CSS Variables** in `styles.scss` for easy theming

---

## Build for Production

```bash
npm run build
```

Output: `dist/examgen-ai/`
