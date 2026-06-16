import type { Flashcard } from "@prisma/client";

const typeLabels: Record<string, string> = {
  FLASHCARD: "Flashcard",
  CLOZE: "Cloze",
  MCQ: "MCQ",
};

const typeColors: Record<string, string> = {
  FLASHCARD: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  CLOZE: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  MCQ: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export function FlashcardList({ flashcards }: { flashcards: Flashcard[] }) {
  if (flashcards.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">
        Generated Flashcards ({flashcards.length})
      </h2>
      <div className="flex flex-col gap-3">
        {flashcards.map((card) => (
          <div key={card.id} className="brutal-card rounded-md bg-card p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border-2 border-foreground ${typeColors[card.type]}`}
              >
                {typeLabels[card.type]}
              </span>
            </div>
            <p className="text-sm font-medium">{card.front}</p>
            <p className="text-sm text-muted-foreground border-t pt-2">{card.back}</p>
            {card.type === "MCQ" && Array.isArray(card.options) && (
              <ul className="mt-1 flex flex-col gap-1">
                {(card.options as string[]).map((opt, i) => (
                  <li
                    key={i}
                    className={`text-sm px-2 py-1 rounded-md ${
                      opt === card.back
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "text-muted-foreground"
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
