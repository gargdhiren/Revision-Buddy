import Link from "next/link";
import { ArrowRight, Brain, Sparkles, BarChart3, BookOpen, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Flashcard Generation",
    description:
      "Write your notes, click one button. Our AI reads your content and generates flashcards, MCQs, and cloze deletions automatically.",
  },
  {
    icon: Brain,
    title: "Spaced Repetition",
    description:
      "The Leitner system shows you cards exactly when you're about to forget them. Study less, remember more.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Daily streak, due cards, weekly review chart. Always know where you stand and what needs your attention.",
  },
];

const steps = [
  { number: "01", title: "Write your notes", description: "Use the rich text editor — headings, lists, code blocks, and more." },
  { number: "02", title: "Generate flashcards", description: "One click. AI creates a mix of flashcards, MCQs, and cloze deletions from your content." },
  { number: "03", title: "Review daily", description: "Cards are shown one at a time. Mark correct or incorrect — the system schedules the next review." },
  { number: "04", title: "Track your progress", description: "Watch your streak grow. See exactly how many cards you have mastered." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b-2 border-foreground sticky top-0 bg-background/90 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-foreground bg-primary shadow-sm">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </span>
            <span className="font-bold text-lg">Revision Buddy</span>
          </div>
          <Link href="/signin">
            <Button size="sm">
              Sign in <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 border-2 border-foreground rounded-full bg-card px-4 py-1.5 text-sm font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          AI-powered · Free · Open source
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          Turn your notes into
          <br />
          <span className="inline-block mt-3 -rotate-1 border-2 border-foreground bg-primary px-3 text-primary-foreground shadow-md">
            knowledge that sticks
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Revision Buddy reads your notes and generates flashcards, MCQs, and cloze deletions
          automatically — then schedules your reviews using spaced repetition so you actually
          remember what you study.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signin">
            <Button size="lg" className="gap-2 text-base px-8">
              <GitBranch className="w-4 h-4" />
              Get started free
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button size="lg" variant="outline" className="text-base px-8">
              See how it works
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="brutal-card rounded-md p-8 bg-card transition-transform hover:-translate-x-px hover:-translate-y-px"
            >
              <div className="w-10 h-10 rounded-md border-2 border-foreground bg-primary flex items-center justify-center mb-5 shadow-sm">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-muted-foreground">Four steps from notes to long-term memory.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-5 p-6 brutal-card rounded-md bg-card">
              <span className="text-3xl font-bold text-primary shrink-0 leading-none mt-1">
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y-2 border-foreground bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why spaced repetition?</h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Most people re-read notes and feel productive — but passive review barely moves
              information to long-term memory. Spaced repetition forces active recall at exactly
              the right intervals, exploiting the{" "}
              <span className="text-foreground font-medium">spacing effect</span> proven by over
              100 years of memory research.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: "5×", label: "more efficient than re-reading" },
                { value: "90%+", label: "retention after 30 days" },
                { value: "15 min", label: "average daily review time" },
              ].map((stat) => (
                <div key={stat.label} className="brutal-card rounded-md p-5 bg-card">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start studying smarter today</h2>
        <p className="text-muted-foreground mb-8">Free. No credit card. Sign in with GitHub.</p>
        <Link href="/signin">
          <Button size="lg" className="gap-2 text-base px-10">
            <GitBranch className="w-4 h-4" />
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Revision Buddy</span>
          </div>
          <span>Built with Next.js · Groq AI · Neon</span>
        </div>
      </footer>
    </div>
  );
}
