import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function heading(level: number, text: string) {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}

function paragraph(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function bulletList(...items: string[]) {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
    })),
  };
}

function doc(...blocks: object[]) {
  return JSON.stringify({ type: "doc", content: blocks });
}

const notes = [
  {
    title: "React useState Hook",
    content: doc(
      heading(2, "What is useState?"),
      paragraph(
        "useState is a React Hook that lets you add a state variable to a functional component. When state changes, React re-renders the component with the new value."
      ),
      heading(2, "Syntax"),
      paragraph("const [state, setState] = useState(initialValue)"),
      heading(2, "Key Rules"),
      bulletList(
        "Only call hooks at the top level — never inside loops, conditions, or nested functions",
        "Never mutate state directly — always use the setter function",
        "State updates are asynchronous — the new value is not available on the same render",
        "If new state depends on old state, use the functional update form: setState(prev => prev + 1)"
      ),
      heading(2, "Common Mistake"),
      paragraph(
        "Calling setState multiple times in a row does not stack updates. React batches them. Use functional updates when the new state depends on the previous one."
      )
    ),
  },
  {
    title: "React useEffect Hook",
    content: doc(
      heading(2, "What is useEffect?"),
      paragraph(
        "useEffect lets you synchronize a component with an external system — fetching data, setting up subscriptions, or updating the DOM. It runs after every render by default."
      ),
      heading(2, "Syntax"),
      paragraph("useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, [dependencies])"),
      heading(2, "Dependency Array"),
      bulletList(
        "No array: runs after every render",
        "Empty array []: runs once after the first render only",
        "[a, b]: runs when a or b changes"
      ),
      heading(2, "Cleanup"),
      paragraph(
        "Return a cleanup function to cancel subscriptions, timers, or event listeners. React calls it before running the effect again and when the component unmounts."
      ),
      heading(2, "Common Mistakes"),
      bulletList(
        "Missing dependencies causes stale closures — the effect reads old values",
        "Putting objects or functions in the dependency array causes infinite re-renders",
        "Fetching data inside useEffect instead of using TanStack Query"
      )
    ),
  },
  {
    title: "Next.js Server vs Client Components",
    content: doc(
      heading(2, "Server Components"),
      paragraph(
        "Server Components run on the server and are never sent to the browser as JavaScript. They can directly access databases, file systems, and secrets. They cannot use hooks or browser APIs."
      ),
      heading(2, "Client Components"),
      paragraph(
        "Client Components run in the browser. Add 'use client' at the top of the file. Required when you need useState, useEffect, event listeners, or browser-only APIs."
      ),
      heading(2, "The Rule"),
      bulletList(
        "Default to Server Components — they are faster and smaller",
        "Only add 'use client' when you need interactivity or browser APIs",
        "The client boundary propagates downward — all children of a Client Component are also client-side",
        "You can pass Server Components as children props into Client Components to keep them server-side"
      ),
      heading(2, "Data Fetching"),
      paragraph(
        "In Server Components, fetch data directly — no useEffect, no loading states. In Client Components, use TanStack Query or SWR for server state management."
      )
    ),
  },
  {
    title: "JavaScript Promises and Async/Await",
    content: doc(
      heading(2, "What is a Promise?"),
      paragraph(
        "A Promise is an object representing the eventual completion or failure of an asynchronous operation. It can be in one of three states: pending, fulfilled, or rejected."
      ),
      heading(2, "Async/Await"),
      paragraph(
        "async/await is syntactic sugar over Promises. An async function always returns a Promise. await pauses execution until the Promise resolves."
      ),
      heading(2, "Error Handling"),
      bulletList(
        "Use try/catch with async/await to handle rejections",
        "Unhandled Promise rejections will crash Node.js in newer versions",
        "Promise.all runs multiple promises in parallel and waits for all to resolve",
        "Promise.allSettled runs all promises and returns results even if some fail"
      ),
      heading(2, "Common Mistake"),
      paragraph(
        "Awaiting promises sequentially when they are independent wastes time. Use Promise.all to run them in parallel: const [a, b] = await Promise.all([fetchA(), fetchB()])"
      )
    ),
  },
];

async function main() {
  const user = await db.user.findFirst();
  if (!user) {
    console.error("No user found. Sign in to the app first, then run the seed.");
    process.exit(1);
  }

  console.log(`Seeding notes for ${user.email}...`);

  for (const note of notes) {
    await db.note.create({
      data: {
        title: note.title,
        content: note.content,
        userId: user.id,
      },
    });
    console.log(`Created: ${note.title}`);
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
