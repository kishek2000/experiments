# CLAUDE.md - Instructions for Claude Code

## Project: Lipi (लिपि) - Hindi Script Learning App

A web app to help Hindi speakers learn to read and write Devanagari. The user practices writing on paper; the app provides curriculum, testing, and progress tracking.

## Before Each Task

1. Read the task description in TASKS.md
2. Check LIPI_IMPLEMENTATION_PLAN.md for detailed specs if needed
3. Look at existing code for patterns to follow

## After Each Task

1. Verify TypeScript compiles: `npx tsc --noEmit`
2. Mark task complete in TASKS.md: change `- [ ]` to `- [x]`
3. Say "TASK COMPLETE: [task_id]"

## Tech Stack

- **Framework**: React Router v7 (Remix) with file-based routing
- **Language**: TypeScript (strict)
- **Package Manager**: Yarn  
- **Styling**: TailwindCSS (utility classes)
- **Database**: Dexie.js (IndexedDB wrapper)
- **No backend** - fully client-side

## File Structure

```
app/
├── routes/           # Page routes (file-based)
├── components/
│   ├── ui/          # Button, Card, Modal, etc.
│   ├── letters/     # LetterCard, LetterGrid, StrokeGuide
│   ├── practice/    # Quiz components
│   └── layout/      # Header, Navigation
├── lib/
│   ├── db/          # Dexie database, schema, seed
│   ├── curriculum/  # Letter data, phases, types
│   └── practice/    # Session logic, SRS
└── hooks/           # Custom React hooks
```

## Key Patterns

### Dexie Database
```typescript
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// Query in components
const letters = useLiveQuery(() => db.letters.toArray());
```

### Component Props
```typescript
interface LetterCardProps {
  letter: Letter;
  onClick?: () => void;
  showTransliteration?: boolean;
}

export function LetterCard({ letter, onClick, showTransliteration = true }: LetterCardProps) {
  // ...
}
```

### Route Params
```typescript
// app/routes/learn.$phaseId.tsx
import { useParams } from 'react-router';

export default function PhasePage() {
  const { phaseId } = useParams();
  // ...
}
```

## Quality Requirements

- No TypeScript errors (run `npx tsc --noEmit`)
- No `any` types unless absolutely necessary  
- Functional components with proper interfaces
- TailwindCSS for all styling
- Mobile-first responsive design

## Hindi Content

- Use actual Devanagari characters (UTF-8)
- Transliteration uses common romanization (a, aa, i, ii, u, uu, e, ai, o, au)
- Every letter needs: devanagari, transliteration, pronunciationGuide, exampleWords

## Common Commands

```bash
yarn dev          # Start dev server
yarn build        # Production build  
npx tsc --noEmit  # Type check
```
