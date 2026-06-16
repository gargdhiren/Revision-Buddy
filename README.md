# Revision Buddy

> Study smarter. Remember longer.

**Revision Buddy** is an AI-powered notes and memorization app. You write notes, it generates flashcards, cloze deletions, and MCQs — then schedules your reviews using spaced repetition so you actually retain what you study.

### 🔗 [Live Demo → revision-and-notes-buddy.vercel.app](https://revision-and-notes-buddy.vercel.app)

> Sign in with GitHub, create a note, hit **Generate Flashcards**, then head to **Review**.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8)

---

## The Problem

Most people take notes and never look at them again. Passive re-reading feels productive but doesn't build long-term memory. Revision Buddy turns your notes into an active study system — the same method used by medical students, language learners, and anyone who needs to remember a lot of information.

---

## For Recruiters — Engineering Highlights

This is a full-stack app built to production standard, not a tutorial clone. Things worth a look:

- **Modern Next.js App Router** — React Server Components for data fetching, Server Actions for mutations, and route-level `loading.tsx` skeletons (Suspense) for instant navigation feedback.
- **Spaced-repetition engine** — the Leitner algorithm (5 boxes, 1→2→4→8→16-day intervals) implemented server-side in the review API, with cache revalidation (`revalidatePath`) so the "due" badge stays accurate across the app.
- **AI with guardrails** — structured flashcard generation via the Vercel AI SDK + Groq, with **Zod** validation of the model's JSON output before anything touches the database.
- **Auth & route protection** — NextAuth v5 (GitHub OAuth) with JWT sessions and Next.js middleware guarding protected routes.
- **Prisma 7 with a driver adapter** — `@prisma/adapter-pg` for the new Prisma 7 client architecture, connection config split between runtime and CLI (`prisma.config.ts`).
- **Custom design system** — a hand-built **neobrutalist** theme (hard offset shadows, thick borders, single lavender accent) on Tailwind CSS v4 + Base UI primitives, with full light/dark theming via CSS variables.
- **UX polish** — debounced auto-save, double-submit guards, pending states on every async action, and tailored loading skeletons per route.

---

## How it Works

1. **Write notes** in a rich text editor (Tiptap)
2. **Generate flashcards** — AI reads your note and creates flashcards, MCQs, and cloze deletions
3. **Review daily** — cards are shown one at a time using the Leitner spaced repetition system
4. **Track progress** — dashboard shows streaks, due cards, a learning-technique breakdown, a mastery bar, and weekly activity

---

## Features

### Notes
- Rich text editor (Tiptap) — headings, bold, italic, lists, code blocks
- Debounced auto-save
- Search notes by title
- Create, edit, delete

### AI (powered by Groq — fast, free)
- Generates flashcards, MCQs with plausible wrong answers, and cloze deletions from any note
- One click — output is Zod-validated, then saved to the database
- Re-generate any time to refresh a note's cards

### Spaced Repetition
- Leitner system (5 boxes), mixed review sessions (flashcards, cloze, MCQs shuffled)
- Correct → next box; Incorrect → back to box 1
- Automatic scheduling (1, 2, 4, 8, 16-day intervals)
- Session summary with score

### Progress Dashboard
- Due-cards count with one-click review
- Learning-technique breakdown (active recall / cloze / MCQ counts)
- Leitner mastery bar across the 5 boxes
- Study-streak tracking and a weekly correct-vs-incorrect chart

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 · Base UI · custom neobrutalist design system |
| Editor | Tiptap |
| Auth | NextAuth.js v5 (GitHub OAuth, JWT, middleware) |
| AI | Vercel AI SDK + Groq (llama-3.3-70b-versatile) · Zod validation |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 + `@prisma/adapter-pg` driver adapter |
| Charts | Recharts |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- A [Neon](https://neon.tech) database (free tier works)
- A [Groq](https://console.groq.com) API key (free)
- A GitHub OAuth App

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd revision-buddy

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values (see below)

# Apply the schema to your database
pnpm exec prisma db push

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
AUTH_SECRET=           # Generate with: pnpm dlx auth secret
AUTH_GITHUB_ID=        # GitHub OAuth App Client ID
AUTH_GITHUB_SECRET=    # GitHub OAuth App Client Secret
DATABASE_URL=          # Postgres connection string (pooled URL in production)
GROQ_API_KEY=          # Groq API key (free at console.groq.com)
```

#### GitHub OAuth Setup
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

---

## Deploying to Vercel

1. Push to GitHub and import the repo on [vercel.com](https://vercel.com)
2. Add all environment variables in the project settings
3. Create a **second** GitHub OAuth App for production with callback `https://<your-app>.vercel.app/api/auth/callback/github`
4. Use a **pooled** `DATABASE_URL` (e.g. Neon's pooler) for serverless
5. Deploy

The build script runs `prisma generate && next build`, so the Prisma client is generated on every deploy.

---

## Project Structure

```
src/
├── app/                    # Routes (Next.js App Router)
│   ├── (auth)/             # Public routes — signin, with loading skeleton
│   ├── (dashboard)/        # Protected routes — dashboard, notes, review
│   │   ├── loading.tsx     # Route-level Suspense skeletons (per route)
│   │   └── ...
│   ├── api/
│   │   ├── auth/           # NextAuth handler
│   │   ├── notes/          # Notes CRUD route handlers
│   │   ├── ai/generate/    # AI flashcard generation (Zod-validated)
│   │   └── review/         # Review result submission + cache revalidation
│   └── icon.svg            # App favicon (brand mark)
├── components/
│   ├── dashboard/          # Dashboard charts and stats
│   ├── notes/              # NoteEditor, NoteCard, RichTextEditor
│   ├── review/             # ReviewSession (Leitner UI)
│   └── ui/                 # Base UI primitives + Skeleton
├── lib/
│   ├── actions/            # Server Actions (createNote, deleteNote)
│   ├── auth.ts             # NextAuth config
│   ├── db.ts               # Prisma client + pg driver adapter
│   └── tiptap.ts           # Tiptap JSON utilities
└── types/                  # TypeScript type definitions
```

---

## Roadmap

### MVP — complete
- [x] App Router scaffold, sidebar/header layout, dark/light mode
- [x] GitHub OAuth + protected routes
- [x] PostgreSQL schema (Neon) + Prisma 7
- [x] Notes CRUD — rich text editor, auto-save, search, delete
- [x] AI flashcard, MCQ, and cloze generation (Groq)
- [x] Leitner spaced-repetition review sessions
- [x] Progress dashboard — streak, technique breakdown, mastery, weekly chart
- [x] Neobrutalist design system + per-route loading skeletons

### v2 — planned
- Mind maps (React Flow)
- Feynman / teach-back mode
- Cheat-sheet generation
- SM-2 algorithm upgrade
- Manual marking syntax (`==term==`, `{{cloze}}`)
- Full-text note search (not just titles)
- PWA / mobile
- Import from Notion / Anki / Quizlet

---

## Status

**MVP complete and deployed.** → [revision-and-notes-buddy.vercel.app](https://revision-and-notes-buddy.vercel.app)
