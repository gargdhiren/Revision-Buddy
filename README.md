# RevisionBuddy

> Study smarter. Remember longer.

RevisionBuddy is an AI-powered notes and memorization app. You write notes, it generates flashcards, cloze deletions, and MCQs from them — then schedules your reviews using spaced repetition so you actually retain what you study.

---

## The Problem

Most people take notes and never look at them again. Passive re-reading feels productive but doesn't build long-term memory. RevisionBuddy turns your notes into an active study system — the same method used by medical students, language learners, and anyone who needs to remember a lot of information.

---

## How it Works

1. **Write notes** in a Markdown editor
2. **Mark terms** manually (`==term==` for flashcards, `{{term}}` for cloze) or let AI detect them
3. **AI generates** flashcards, MCQs, and cloze deletions from your content
4. **Review daily** — cards are shown using the Leitner spaced repetition system
5. **Track progress** — see retention curves, streaks, and weak spots on your dashboard

---

## Features

### Notes
- Markdown editor with live preview
- Auto-save
- Manual syntax for marking terms (`==term==`, `{{term}}`)
- Search, filter, and folder/tag organization

### AI (powered by Ollama — runs locally, no API costs)
- Auto-detects content type (definitions, processes, comparisons, lists)
- Generates flashcards, MCQs with plausible wrong answers, and cloze deletions
- Hybrid mode — manual marks + AI fills the gaps
- Mnemonic generation
- Note review — flags inaccuracies, gaps, and unclear sections

### Spaced Repetition
- Leitner system (5 boxes)
- Mixed review sessions — flashcards, cloze, and MCQs shuffled together
- Card rating (correct/incorrect) moves cards between boxes
- Automatic scheduling of next review dates
- Session summary with score and weak areas

### Progress Dashboard
- Due cards count and study streaks
- Strength meter per card
- Weak spot identification
- Basic retention curves

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Global State | Zustand |
| Server State | TanStack Query |
| Forms | React Hook Form + Zod |
| Auth | NextAuth.js v5 (GitHub OAuth) |
| AI | Vercel AI SDK + Ollama (local) |
| Database | PostgreSQL |
| Charts | Recharts |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL
- [Ollama](https://ollama.ai) (for AI features)

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

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
AUTH_SECRET=           # Generate with: pnpm dlx auth secret
AUTH_GITHUB_ID=        # GitHub OAuth App Client ID
AUTH_GITHUB_SECRET=    # GitHub OAuth App Client Secret
DATABASE_URL=          # PostgreSQL connection string (coming soon)
```

To set up GitHub OAuth:
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

---

## Project Structure

```
src/
├── app/                    # Routes (Next.js App Router)
│   ├── (auth)/             # Public routes — signin, signup
│   ├── (dashboard)/        # Protected routes — dashboard, notes, review
│   └── api/
│       ├── auth/           # NextAuth handler
│       └── notes/          # Notes CRUD route handlers
├── components/             # Reusable UI components
│   ├── notes/              # Notes-specific components (NoteEditor, NoteCard)
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── actions/            # Server Actions (createNote, deleteNote)
│   ├── auth.ts             # NextAuth config
│   └── db.ts               # Prisma singleton
├── hooks/                  # Custom React hooks
├── store/                  # Zustand global state
└── types/                  # TypeScript type definitions
```

---

## Roadmap

### MVP (in progress)
- [x] Project setup + App Router scaffold
- [x] Layout — sidebar, header, dark/light mode
- [x] Auth — GitHub OAuth, protected routes
- [x] Database schema + PostgreSQL connection (Neon)
- [x] Notes CRUD — create, auto-save, delete
- [ ] Markdown editor with live preview
- [ ] Manual marking syntax + flashcard generation
- [ ] AI flashcard, MCQ, and cloze generation
- [ ] Spaced repetition review sessions
- [ ] Progress dashboard

### v2 (planned)
- Mind maps (React Flow)
- Feynman / teach-back mode
- Cheat sheet generation
- SM-2 algorithm upgrade
- Mobile app (PWA)
- Collaboration — share notes and decks
- Import from Notion / Anki / Quizlet

---

## Status

Active development. Currently completing **Phase 2 — Notes System**.
