"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Flashcard } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, BookOpen, ArrowRight } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const typeColors: Record<string, string> = {
  FLASHCARD: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  CLOZE: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  MCQ: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const typeLabels: Record<string, string> = {
  FLASHCARD: "Flashcard",
  CLOZE: "Cloze",
  MCQ: "Multiple Choice",
};

export function ReviewSession({ flashcards }: { flashcards: Flashcard[] }) {
  const router = useRouter();
  const [cards] = useState(() => shuffle(flashcards));
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const card = cards[index];

  async function submitResult(result: "CORRECT" | "INCORRECT") {
    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flashcardId: card.id, result }),
    });

    if (result === "CORRECT") setCorrect((c) => c + 1);
    else setIncorrect((i) => i + 1);

    if (index + 1 >= cards.length) {
      setIsComplete(true);
    } else {
      setTimeout(() => {
        setIndex((i) => i + 1);
        setShowAnswer(false);
        setSelectedOption(null);
      }, 600);
    }
  }

  async function handleMCQOption(option: string) {
    if (selectedOption) return;
    setSelectedOption(option);
    const isCorrect = option === card.back;
    await submitResult(isCorrect ? "CORRECT" : "INCORRECT");
  }

  if (isComplete) {
    const total = correct + incorrect;
    const pct = Math.round((correct / total) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Session Complete!</h2>
          <p className="text-muted-foreground mt-1">You reviewed {total} cards</p>
        </div>
        <p className="text-6xl font-bold text-primary">{pct}%</p>
        <div className="flex gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-green-600">
            <CheckCircle className="w-4 h-4" /> {correct} correct
          </span>
          <span className="flex items-center gap-1.5 text-red-500">
            <XCircle className="w-4 h-4" /> {incorrect} incorrect
          </span>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.refresh()}>Review Again</Button>
          <Button variant="outline" onClick={() => router.push("/notes")}>
            Back to Notes
          </Button>
        </div>
      </motion.div>
    );
  }

  const options = card.type === "MCQ" && Array.isArray(card.options)
    ? (card.options as string[])
    : [];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Card {index + 1} of {cards.length}</span>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-3.5 h-3.5" /> {correct}
          </span>
          <span className="flex items-center gap-1 text-red-500">
            <XCircle className="w-3.5 h-3.5" /> {incorrect}
          </span>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-1">
        <motion.div
          className="bg-primary h-1 rounded-full"
          animate={{ width: `${(index / cards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="border rounded-2xl p-8 bg-card flex flex-col gap-6 min-h-[300px]"
        >
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${typeColors[card.type]}`}>
            {typeLabels[card.type]}
          </span>

          <p className="text-xl font-medium leading-relaxed">{card.front}</p>

          {card.type === "MCQ" && (
            <div className="flex flex-col gap-2">
              {options.map((option, i) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === card.back;
                let cls = "border rounded-xl px-4 py-3 text-sm text-left transition-all cursor-pointer";
                if (selectedOption) {
                  if (isCorrectOption) cls += " border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                  else if (isSelected) cls += " border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                  else cls += " opacity-40";
                } else {
                  cls += " hover:bg-accent hover:border-primary/30";
                }
                return (
                  <button key={i} className={cls} onClick={() => handleMCQOption(option)}>
                    <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {card.type !== "MCQ" && (
            <>
              {!showAnswer ? (
                <Button variant="outline" onClick={() => setShowAnswer(true)} className="gap-2 self-start">
                  Show Answer <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Answer</p>
                    <p className="text-lg font-medium">{card.back}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => submitResult("CORRECT")}
                    >
                      <CheckCircle className="w-4 h-4" /> Correct
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      variant="outline"
                      onClick={() => submitResult("INCORRECT")}
                    >
                      <XCircle className="w-4 h-4" /> Incorrect
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {card.type === "MCQ" && selectedOption && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium flex items-center gap-1.5 ${selectedOption === card.back ? "text-green-600" : "text-red-500"}`}
            >
              {selectedOption === card.back ? (
                <><CheckCircle className="w-4 h-4" /> Correct!</>
              ) : (
                <><XCircle className="w-4 h-4" /> The answer was: {card.back}</>
              )}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
