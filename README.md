# RevisionBuddy

> Study smarter. Remember longer.

RevisionBuddy is an AI-powered notes and memorization app. You write notes, it generates flashcards, cloze deletions, and MCQs — then schedules your reviews using spaced repetition so you actually retain what you study.

---

## The Problem

Most people take notes and never look at them again. Passive re-reading feels productive but doesn't build long-term memory. RevisionBuddy turns your notes into an active study system — the same method used by medical students, language learners, and anyone who needs to remember a lot of information.

---

## How it Works

1. **Write notes** in a rich text editor
2. **Generate flashcards** — AI reads your note and creates flashcards, MCQs, and cloze deletions
3. **Review daily** — cards are shown one at a time using the Leitner spaced repetition system
4. **Track progress** — dashboard shows streaks, due cards, and weekly activity

---

## Features

### Notes
- Rich text editor (Tiptap) with toolbar — headings, bold, italic, lists, code blocks
- Auto-save with debounce
- Search notes by title
- Create, edit, delete

### AI (powered by Groq — fast, free)
- Generates flashcards, MCQs with plausible wrong answers, and cloze deletions from any note
- One click — results saved to database instantly
- Re-generate any time to refresh cards

### Spaced Repetition
- Leitner system (5 boxes)
- Mixed review sessions — flashcards, cloze, and MCQs shuffled
- Correct → move to next box, Incorrect → back to box 1
- Automatic scheduling (1, 2, 4, 8, 16 day intervals)
- Session summary with score

### Progress Dashboard
- Due cards count with one-click review
- Total notes and flashcard counts
- Study streak tracking
- Weekly review activity chart (correct vs incorrect)
- Recent notes list

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Editor | Tiptap |
| Auth | NextAuth.js v5 (GitHub OAuth) |
| AI | Vercel AI SDK + Groq (llama-3.3-70b) |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Charts | Recharts |
| Deploy | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
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
# Fill in your values

# Run database migrations
npx prisma@5 migrate deploy

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
AUTH_SECRET=           # Generate with: pnpm dlx auth secret
AUTH_GITHUB_ID=        # GitHub OAuth App Client ID
AUTH_GITHUB_SECRET=    # GitHub OAuth App Client Secret
DATABASE_URL=          # Neon PostgreSQL connection string
GROQ_API_KEY=          # Groq API key (free at console.groq.com)
```

#### GitHub OAuth Setup
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

---

## Deploying to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all environment variables from above in Vercel project settings
4. Update GitHub OAuth App callback URL to `https://your-app.vercel.app/api/auth/callback/github`
5. Deploy

Vercel auto-runs `pnpm build` which includes `prisma generate`.

---

## Project Structure

```
src/
├── app/                    # Routes (Next.js App Router)
│   ├── (auth)/             # Public routes — signin
│   ├── (dashboard)/        # Protected routes — dashboard, notes, review
│   └── api/
│       ├── auth/           # NextAuth handler
│       ├── notes/          # Notes CRUD route handlers
│       ├── ai/generate/    # AI flashcard generation
│       └── review/         # Review result submission
├── components/
│   ├── dashboard/          # Dashboard charts and stats
│   ├── notes/              # NoteEditor, NoteCard, RichTextEditor
│   ├── review/             # ReviewSession
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── actions/            # Server Actions (createNote, deleteNote)
│   ├── auth.ts             # NextAuth config
│   ├── db.ts               # Prisma singleton
│   └── tiptap.ts           # Tiptap JSON utilities
└── types/                  # TypeScript type definitions
```

---

## Roadmap

### MVP
- [x] Project setup + App Router scaffold
- [x] Layout — sidebar, header, dark/light mode
- [x] Auth — GitHub OAuth, protected routes
- [x] Database schema + PostgreSQL (Neon)
- [x] Notes CRUD — create, rich text editor, auto-save, search, delete
- [x] AI flashcard, MCQ, and cloze generation (Groq)
- [x] Spaced repetition review sessions (Leitner system)
- [x] Progress dashboard with streak and weekly chart

### v2 (planned)
- Mind maps (React Flow)
- Feynman / teach-back mode
- Cheat sheet generation
- SM-2 algorithm upgrade
- Manual marking syntax (`==term==`, `{{cloze}}`)
- Search note content (not just title)
- Mobile app (PWA)
- Import from Notion / Anki / Quizlet

---

## Status

MVP complete. Deployed on Vercel.
