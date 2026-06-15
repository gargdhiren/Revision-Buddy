# RevisionBuddy

An AI-powered notes and memorization app built with Next.js, TypeScript, and Tailwind CSS.

## What it does

RevisionBuddy helps you retain what you study by turning your notes into flashcards, cloze deletions, and MCQs — automatically. It uses spaced repetition (Leitner system) to schedule reviews at the right time, so you study smarter, not harder.

## Features (MVP in progress)

- **Auth** — GitHub OAuth via NextAuth.js
- **Notes** — Markdown editor with live preview and auto-save *(coming soon)*
- **AI Generation** — Flashcards, MCQs, and cloze deletions from your notes via Ollama *(coming soon)*
- **Spaced Repetition** — Leitner system with scheduled reviews *(coming soon)*
- **Progress Dashboard** — Retention curves, streaks, weak spot identification *(coming soon)*

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
| Auth | NextAuth.js v5 |
| AI | Vercel AI SDK + Ollama (local) |
| Database | PostgreSQL |
| Charts | Recharts |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL *(coming soon)*
- Ollama *(coming soon)*

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd revision-buddy

# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local and fill in the values below

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file with the following:

```env
AUTH_SECRET=           # Generate with: pnpm dlx auth secret
AUTH_GITHUB_ID=        # GitHub OAuth App Client ID
AUTH_GITHUB_SECRET=    # GitHub OAuth App Client Secret
```

To set up GitHub OAuth:
1. Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

## Project Structure

```
src/
├── app/                    # Route tree (Next.js App Router)
│   ├── (auth)/             # Auth routes — signin, signup
│   ├── (dashboard)/        # Protected routes — dashboard, notes, review
│   └── api/auth/           # NextAuth API handler
├── components/             # Reusable UI components
│   └── ui/                 # shadcn/ui primitives
├── lib/                    # Logic layer
│   └── auth.ts             # NextAuth config
├── hooks/                  # Custom React hooks
├── store/                  # Zustand global state
└── types/                  # TypeScript type definitions
```

## Status

Currently in **Phase 1 — Foundation**. See [project_plan.md](./project_plan.md) for the full roadmap.
