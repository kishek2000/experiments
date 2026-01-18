# Lipi (लिपि) - Hindi Script Learning Application

## Complete Implementation Plan

**Project Name**: Lipi (meaning "script" in Hindi/Sanskrit)
**Purpose**: Help Hindi speakers learn to read and write Devanagari script
**Philosophy**: Digital companion to traditional pen-and-paper practice - the app tells you WHAT to practice, tracks progress, and tests recognition. Actual writing happens offline.

---

## Tech Stack

- **Framework**: React Router v7 (Remix) - already initialized
- **Language**: TypeScript (strict mode)
- **Package Manager**: Yarn
- **Styling**: TailwindCSS (assume already configured)
- **Client DB**: Dexie.js (IndexedDB wrapper)
- **Audio**: Native Web Audio API or HTML5 audio elements
- **No backend** - fully client-side, all state in IndexedDB

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        ROUTES                                │
│  /                    - Dashboard/Home                       │
│  /learn               - Current lesson view                  │
│  /learn/:phaseId      - Phase overview                       │
│  /learn/:phaseId/:lessonId - Specific lesson                │
│  /practice            - Practice session launcher            │
│  /practice/write      - Writing practice prompts             │
│  /practice/recognize  - Recognition quiz                     │
│  /reference           - Full alphabet reference              │
│  /reference/:letterId - Individual letter deep-dive          │
│  /progress            - Progress &amp; statistics                │
│  /settings            - App settings                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Dexie)                        │
│                                                              │
│  Tables:                                                     │
│  - letters (static curriculum data, seeded on first load)   │
│  - letterProgress (user's mastery per letter)               │
│  - sessions (practice session history)                       │
│  - settings (user preferences)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
app/
├── routes/
│   ├── _index.tsx                 # Dashboard
│   ├── learn.tsx                  # Learn layout
│   ├── learn._index.tsx           # Curriculum overview
│   ├── learn.$phaseId.tsx         # Phase detail
│   ├── learn.$phaseId.$lessonId.tsx # Lesson view
│   ├── practice.tsx               # Practice layout
│   ├── practice._index.tsx        # Practice mode selector
│   ├── practice.write.tsx         # Writing practice
│   ├── practice.recognize.tsx     # Recognition quiz
│   ├── reference.tsx              # Reference layout
│   ├── reference._index.tsx       # Full alphabet grid
│   ├── reference.$letterId.tsx    # Single letter detail
│   ├── progress.tsx               # Progress dashboard
│   └── settings.tsx               # Settings
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   │
│   ├── letters/
│   │   ├── LetterCard.tsx         # Display single letter with info
│   │   ├── LetterGrid.tsx         # Grid of multiple letters
│   │   ├── StrokeGuide.tsx        # Stroke order visualization
│   │   ├── MatraDemo.tsx          # Shows matra attachment to consonants
│   │   └── AudioButton.tsx        # Play pronunciation
│   │
│   ├── practice/
│   │   ├── WritingPrompt.tsx      # "Write X 10 times"
│   │   ├── RecognitionCard.tsx    # Shows letter, asks for identification
│   │   ├── MultipleChoice.tsx     # MCQ for recognition
│   │   ├── TransliterationInput.tsx # Type romanized version
│   │   ├── SessionProgress.tsx    # Progress within session
│   │   └── SessionComplete.tsx    # End of session summary
│   │
│   ├── curriculum/
│   │   ├── PhaseCard.tsx          # Phase overview card
│   │   ├── LessonCard.tsx         # Lesson in a phase
│   │   ├── LessonContent.tsx      # Lesson teaching content
│   │   └── UnlockIndicator.tsx    # Shows if lesson is available
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── PageContainer.tsx
│
├── lib/
│   ├── db/
│   │   ├── index.ts               # Dexie database instance
│   │   ├── schema.ts              # Table definitions
│   │   ├── seed.ts                # Initial curriculum data
│   │   └── hooks.ts               # Custom Dexie React hooks
│   │
│   ├── curriculum/
│   │   ├── types.ts               # TypeScript types for curriculum
│   │   ├── phases.ts              # Phase definitions
│   │   ├── vowels.ts              # Vowel letter data
│   │   ├── consonants.ts          # Consonant letter data
│   │   ├── matras.ts              # Matra data
│   │   ├── conjuncts.ts           # Conjunct consonant data
│   │   └── words.ts               # Example words database
│   │
│   ├── practice/
│   │   ├── spaced-repetition.ts   # SRS algorithm (simple Leitner or SM-2)
│   │   ├── session-generator.ts   # Generate practice sessions
│   │   └── scoring.ts             # Score calculations
│   │
│   └── utils/
│       ├── audio.ts               # Audio playback utilities
│       ├── transliteration.ts     # Devanagari ↔ Roman conversion
│       └── date.ts                # Date formatting helpers
│
├── hooks/
│   ├── useCurrentLesson.ts        # Get user's current lesson
│   ├── useLetterProgress.ts       # Get/update letter mastery
│   ├── usePracticeSession.ts      # Manage practice session state
│   └── useSettings.ts             # User settings
│
├── context/
│   └── AppContext.tsx             # Global app state if needed
│
└── styles/
    └── app.css                    # Global styles, Tailwind imports
```

---

## Data Models

### Core Types (lib/curriculum/types.ts)

```typescript
// Letter type - represents any character in the curriculum
interface Letter {
  id: string;                      // Unique ID, e.g., "v-01" for vowel 1
  devanagari: string;              // The actual character: "अ"
  transliteration: string;         // Roman representation: "a"
  ipa: string;                     // IPA pronunciation: "ə"
  pronunciationGuide: string;      // English approximation: "like 'u' in 'but'"
  audioFile?: string;              // Path to audio file
  type: LetterType;
  
  // Curriculum placement
  phaseId: string;
  lessonId: string;
  orderInLesson: number;
  
  // Teaching content
  strokeOrder: StrokeInstruction[];
  teachingNotes: string;           // Tips for learning this letter
  commonMistakes?: string[];       // What learners often confuse
  
  // Related content
  exampleWords: ExampleWord[];
  relatedLetters?: string[];       // IDs of similar/related letters
  
  // For consonants - their matras
  matras?: MatraForm[];
  
  // For conjuncts
  components?: string[];           // Letter IDs that form this conjunct
}

type LetterType = 
  | 'vowel'           // Independent vowels (स्वर)
  | 'consonant'       // Consonants (व्यंजन)
  | 'matra'           // Dependent vowel signs (मात्राएँ)
  | 'conjunct'        // Combined consonants (संयुक्ताक्षर)
  | 'modifier'        // Anusvara, visarga, chandrabindu
  | 'numeral';        // Hindi numerals

interface StrokeInstruction {
  stepNumber: number;
  instruction: string;             // "Draw horizontal line left to right"
  svgPath?: string;                // Optional SVG path data
}

interface ExampleWord {
  devanagari: string;              // "आम"
  transliteration: string;         // "aam"
  meaning: string;                 // "mango"
  audioFile?: string;
  letterHighlightIndex?: number;   // Which position to highlight
}

interface MatraForm {
  vowelId: string;                 // Which vowel this matra represents
  matra: string;                   // The matra character: "ा"
  position: 'before' | 'after' | 'above' | 'below';
  combined: string;                // Consonant + matra combined: "का"
  example: ExampleWord;
}

// Phase and Lesson structure
interface Phase {
  id: string;
  number: number;
  titleHindi: string;              // "स्वर"
  titleEnglish: string;            // "Vowels"
  description: string;
  estimatedDays: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  phaseId: string;
  number: number;
  titleHindi: string;
  titleEnglish: string;
  description: string;
  objectives: string[];
  letterIds: string[];             // Letters taught in this lesson
  prerequisiteLessonIds?: string[];
}
```

### Progress Tracking Types (lib/db/schema.ts)

```typescript
interface LetterProgress {
  letterId: string;                // Primary key
  
  // Mastery tracking
  masteryLevel: MasteryLevel;      // 0-5 scale
  correctCount: number;
  incorrectCount: number;
  lastPracticed?: Date;
  nextReviewDate?: Date;           // For SRS
  
  // Detailed stats
  recognitionAccuracy: number;     // 0-1
  writingConfidence: number;       // Self-reported 0-1
  
  // History
  firstSeen: Date;
  practiceHistory: PracticeRecord[];
}

type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = Never seen
// 1 = Learning (just introduced)
// 2 = Familiar (getting it right sometimes)
// 3 = Comfortable (mostly correct)
// 4 = Confident (rarely wrong)
// 5 = Mastered (automatic recognition)

interface PracticeRecord {
  date: Date;
  sessionId: string;
  type: 'recognition' | 'writing';
  correct: boolean;
  responseTimeMs?: number;
}

interface PracticeSession {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  type: 'recognition' | 'writing' | 'mixed';
  
  // Session content
  letterIds: string[];
  totalQuestions: number;
  correctAnswers: number;
  
  // Detailed results
  results: SessionResult[];
}

interface SessionResult {
  letterId: string;
  correct: boolean;
  userAnswer?: string;
  responseTimeMs?: number;
}

interface UserSettings {
  id: 'user-settings';             // Singleton
  dailyGoalMinutes: number;
  practiceSessionLength: number;   // Number of items per session
  enableAudio: boolean;
  showTransliteration: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Progress
  currentPhaseId: string;
  currentLessonId: string;
  onboardingComplete: boolean;
}
```

---

## Curriculum Content

### Phase 1: Vowels (स्वर) - 2 weeks

**Lesson 1.1: Short Vowels**
- अ (a) - inherent vowel, like 'u' in 'but'
- इ (i) - short i, like 'i' in 'bit'  
- उ (u) - short u, like 'u' in 'put'

**Lesson 1.2: Long Vowels**
- आ (aa) - long a, like 'a' in 'father'
- ई (ee) - long i, like 'ee' in 'feet'
- ऊ (oo) - long u, like 'oo' in 'boot'

**Lesson 1.3: Compound Vowels**
- ए (e) - like 'a' in 'fate'
- ऐ (ai) - like 'ai' in 'fair'
- ओ (o) - like 'o' in 'go'
- औ (au) - like 'ou' in 'out'

**Lesson 1.4: Special Vowels &amp; Modifiers**
- ऋ (ri) - vocalic r (rare in modern Hindi)
- अं (am) - anusvara (nasal)
- अः (ah) - visarga (aspirate)

### Phase 2: Consonants (व्यंजन) - 4 weeks

**Lesson 2.1: Velar Consonants (कंठ्य - throat sounds)**
- क (ka), ख (kha), ग (ga), घ (gha), ङ (nga)
- Teaching note: Emphasize aspirated vs unaspirated distinction

**Lesson 2.2: Palatal Consonants (तालव्य - palate sounds)**
- च (cha), छ (chha), ज (ja), झ (jha), ञ (nya)

**Lesson 2.3: Retroflex Consonants (मूर्धन्य - roof of mouth)**
- ट (Ta), ठ (Tha), ड (Da), ढ (Dha), ण (Na)
- Teaching note: Tongue curls back - unique to Indian languages

**Lesson 2.4: Dental Consonants (दंत्य - teeth sounds)**
- त (ta), थ (tha), द (da), ध (dha), न (na)
- Teaching note: Tongue touches teeth, not alveolar ridge like English

**Lesson 2.5: Labial Consonants (ओष्ठ्य - lip sounds)**
- प (pa), फ (pha), ब (ba), भ (bha), म (ma)

**Lesson 2.6: Semi-vowels (अंतःस्थ)**
- य (ya), र (ra), ल (la), व (va/wa)

**Lesson 2.7: Sibilants &amp; Aspirate (ऊष्म)**
- श (sha), ष (Sha - retroflex), स (sa), ह (ha)

**Lesson 2.8: Dotted Consonants (नुक्ता - Persian/Arabic loans)**
- क़ (qa), ख़ (kha), ग़ (gha), ज़ (za), फ़ (fa)
- ड़ (Ra), ढ़ (Rha) - flapped sounds

### Phase 3: Matras (मात्राएँ) - 3 weeks

**Lesson 3.1: Post-consonant Matras**
- ा (aa-matra) - vertical line after: का
- ी (ee-matra) - hook after: की  
- े (e-matra) - hook above extending right: के
- ै (ai-matra) - double hook above: कै
- ो (o-matra) - above + after: को
- ौ (au-matra) - double above + after: कौ

**Lesson 3.2: Pre-consonant Matra**
- ि (i-matra) - comes BEFORE consonant visually: कि
- Teaching note: This is the trickiest one - written before but pronounced after

**Lesson 3.3: Sub-consonant Matras**
- ु (u-matra) - below consonant: कु
- ू (oo-matra) - extended below: कू
- ृ (ri-matra) - below with hook: कृ

**Lesson 3.4: Modifier Signs**
- ं (anusvara/bindu) - nasalization: कं
- ँ (chandrabindu) - nasal vowel: काँ
- ः (visarga) - final aspiration: कः
- ् (halant/virama) - suppresses inherent vowel: क्

### Phase 4: Two &amp; Three Letter Words - 2 weeks

**Lesson 4.1: Simple CV Words**
- Practice reading: नल, जल, फल, दल
- Words using learned matras: काम, नाम, दाम

**Lesson 4.2: CVC Words**
- Words with final consonant: कमल, नमक
- Practice common words user already knows verbally

**Lesson 4.3: Words with Matras**
- Systematic practice: each matra with common words
- Focus on words from user's vocabulary (spiritual terms, daily objects)

### Phase 5: Half Letters &amp; Conjuncts (संयुक्ताक्षर) - 4 weeks

**Lesson 5.1: Half Letter Formation**
- Rule: Remove vertical line from consonants with vertical line
- Examples: क् + य = क्य, स् + त = स्त
- Practice: क्या, स्कूल, प्यार

**Lesson 5.2: Special Ra Forms**
- Reph (र् above): कर्म, धर्म
- Ra-subscript (below): प्र, क्र, ग्र
- Teaching note: Ra has unique behaviors in conjuncts

**Lesson 5.3: Common Conjuncts**
- High frequency: क्ष (ksha), त्र (tra), ज्ञ (gya/dnya)
- श्र (shra) - common in Sanskrit-origin words
- Practice in context: कक्षा, पत्र, ज्ञान

**Lesson 5.4: Gemination (Double Consonants)**
- Same consonant repeated: पक्का, बच्चा, कुत्ता
- Pronounced with lengthened/emphasized sound

**Lesson 5.5: Complex Conjuncts**
- Three consonant clusters: स्त्र (stra), स्क्र (skra)
- Reading practice with longer words

### Phase 6: Reading Practice &amp; Refinement - 2 weeks

**Lesson 6.1: Sentence Reading**
- Simple sentences combining all elements
- Focus on common sentence patterns

**Lesson 6.2: Numbers &amp; Punctuation**
- Hindi numerals: ० १ २ ३ ४ ५ ६ ७ ८ ९
- Punctuation: । (danda - full stop), ॥ (double danda)

**Lesson 6.3: Contextual Reading**
- Spiritual texts (mantras, shlokas)
- Signs, labels, everyday Hindi
- Song lyrics, poetry

---

## Implementation Phases

### PHASE A: Foundation (Tasks 1-5)

**Task A1: Install Dependencies**
```bash
yarn add dexie dexie-react-hooks
```

**Task A2: Set Up Database**
- Create `app/lib/db/index.ts` with Dexie instance
- Define tables: letters, letterProgress, sessions, settings
- Add versioning for future schema migrations

**Task A3: Create Type Definitions**
- Create `app/lib/curriculum/types.ts` with all interfaces
- Create `app/lib/db/schema.ts` with database-specific types
- Ensure strict TypeScript throughout

**Task A4: Build Curriculum Data Files**
- Create `app/lib/curriculum/phases.ts` - phase/lesson structure
- Create `app/lib/curriculum/vowels.ts` - all vowel data
- Create `app/lib/curriculum/consonants.ts` - all consonant data
- Create `app/lib/curriculum/matras.ts` - all matra data
- Create `app/lib/curriculum/conjuncts.ts` - common conjuncts
- Create `app/lib/curriculum/words.ts` - example words database

**Task A5: Database Seeding**
- Create `app/lib/db/seed.ts` 
- Seed letters table on first app load
- Initialize default settings
- Create hook to check if seeding needed

---

### PHASE B: Core UI Components (Tasks 6-10)

**Task B1: UI Primitives**
- Create `app/components/ui/Button.tsx` - primary, secondary, ghost variants
- Create `app/components/ui/Card.tsx` - for content cards
- Create `app/components/ui/ProgressBar.tsx` - linear progress indicator
- Create `app/components/ui/Badge.tsx` - for mastery levels, status
- Create `app/components/ui/Modal.tsx` - for dialogs

**Task B2: Layout Components**
- Create `app/components/layout/Header.tsx` - app header with nav
- Create `app/components/layout/Navigation.tsx` - bottom/side nav
- Create `app/components/layout/PageContainer.tsx` - consistent page wrapper
- Update root layout to use these components

**Task B3: Letter Display Components**
- Create `app/components/letters/LetterCard.tsx`
  - Shows devanagari character large
  - Transliteration below
  - Pronunciation guide
  - Audio play button
  - Mastery indicator
- Create `app/components/letters/LetterGrid.tsx`
  - Grid display of multiple letters
  - Filterable by type, phase
  - Click to expand/navigate

**Task B4: Stroke Order Component**
- Create `app/components/letters/StrokeGuide.tsx`
  - Numbered step-by-step instructions
  - Optional SVG animation (stretch goal)
  - "Practice on paper" reminder

**Task B5: Audio Functionality**
- Create `app/lib/utils/audio.ts`
  - Preload audio files
  - Play pronunciation on demand
  - Handle audio not available gracefully
- Create `app/components/letters/AudioButton.tsx`
  - Play button with loading state
  - Visual feedback on play

---

### PHASE C: Curriculum &amp; Learning Routes (Tasks 11-15)

**Task C1: Dashboard Route**
- Create `app/routes/_index.tsx`
  - Welcome message (personalized after onboarding)
  - Current lesson card with continue button
  - Today's practice summary
  - Quick stats (letters learned, streak)
  - Quick links to practice modes

**Task C2: Learn Section Routes**
- Create `app/routes/learn.tsx` - layout with breadcrumbs
- Create `app/routes/learn._index.tsx` - all phases overview
  - Phase cards showing progress
  - Visual curriculum map
- Create `app/routes/learn.$phaseId.tsx` - single phase view
  - Phase description
  - Lesson list with completion status
  - Lock/unlock based on prerequisites

**Task C3: Lesson Route**
- Create `app/routes/learn.$phaseId.$lessonId.tsx`
  - Lesson objectives
  - Letters being taught (LetterCard for each)
  - Stroke order guides
  - Example words
  - "I've practiced writing" confirmation
  - "Ready to test" button → practice mode

**Task C4: Reference Section**
- Create `app/routes/reference.tsx` - layout
- Create `app/routes/reference._index.tsx`
  - Full alphabet grid
  - Filter by: vowels, consonants, matras, conjuncts
  - Search by transliteration
- Create `app/routes/reference.$letterId.tsx`
  - Deep dive on single letter
  - All example words
  - Related letters
  - For consonants: all matra combinations

**Task C5: Custom Hooks for Curriculum**
- Create `app/hooks/useCurrentLesson.ts`
  - Returns user's current position in curriculum
- Create `app/hooks/useLessonProgress.ts`
  - Returns completion status for a lesson
- Create `app/hooks/usePhaseProgress.ts`
  - Aggregate progress for a phase

---

### PHASE D: Practice System (Tasks 16-22)

**Task D1: Practice Route Structure**
- Create `app/routes/practice.tsx` - layout
- Create `app/routes/practice._index.tsx`
  - Mode selection: Writing Practice, Recognition Quiz
  - Scope selection: Current lesson, Review weak letters, All learned
  - Session length selector

**Task D2: Writing Practice Mode**
- Create `app/routes/practice.write.tsx`
- Create `app/components/practice/WritingPrompt.tsx`
  - Shows letter to practice
  - Stroke order reference
  - "Write this 10 times on paper"
  - Self-assessment: "How did it go?" (good/okay/struggled)
  - Next button
- Track self-reported confidence

**Task D3: Recognition Quiz Mode**  
- Create `app/routes/practice.recognize.tsx`
- Create `app/components/practice/RecognitionCard.tsx`
  - Shows devanagari letter
  - User must identify it
- Create `app/components/practice/MultipleChoice.tsx`
  - 4 transliteration options
  - Visual feedback on answer
- Create `app/components/practice/TransliterationInput.tsx`
  - Type the romanized version
  - Flexible matching (accept common variations)

**Task D4: Session Management**
- Create `app/lib/practice/session-generator.ts`
  - Generate session based on scope selection
  - Prioritize letters due for review (SRS)
  - Mix in some mastered letters for reinforcement
- Create `app/hooks/usePracticeSession.ts`
  - Session state management
  - Track current question, score
  - Handle session completion

**Task D5: Spaced Repetition Logic**
- Create `app/lib/practice/spaced-repetition.ts`
  - Simple Leitner system or SM-2 algorithm
  - Calculate next review date based on performance
  - Determine which letters need review

**Task D6: Session Results**
- Create `app/components/practice/SessionProgress.tsx`
  - Progress bar during session
  - Current score
- Create `app/components/practice/SessionComplete.tsx`
  - Final score
  - Letters that need more practice
  - Option to retry weak letters
  - Save session to database

**Task D7: Progress Update Logic**
- Create `app/lib/practice/scoring.ts`
  - Update masteryLevel based on session results
  - Calculate accuracy trends
- Ensure letterProgress table is updated after each session

---

### PHASE E: Progress Tracking (Tasks 23-26)

**Task E1: Progress Dashboard Route**
- Create `app/routes/progress.tsx`
  - Overall stats card (total letters, mastery distribution)
  - Current streak
  - Time spent (if tracking)
  - Mastery breakdown chart

**Task E2: Progress Visualization Components**
- Create mastery level distribution (pie/bar chart)
- Create calendar heatmap of practice days (stretch goal)
- Create per-phase progress bars

**Task E3: Letter-by-Letter Progress**
- List view of all letters with mastery indicators
- Filter by: struggling, learning, mastered
- Sort by: last practiced, mastery level, curriculum order
- Click to see detailed history

**Task E4: Statistics Hooks**
- Create `app/hooks/useOverallProgress.ts`
- Create `app/hooks/useLetterProgress.ts`
- Create `app/hooks/usePracticeStats.ts`

---

### PHASE F: Settings &amp; Polish (Tasks 27-30)

**Task F1: Settings Route**
- Create `app/routes/settings.tsx`
  - Daily goal setting
  - Session length preference
  - Audio on/off
  - Show/hide transliteration toggle
  - Theme selection
  - Reset progress (with confirmation)

**Task F2: Onboarding Flow**
- First-time user experience
- Brief introduction to the app
- Set initial preferences
- Mark onboarding complete

**Task F3: Empty States &amp; Loading**
- Design empty states for each section
- Loading skeletons where appropriate
- Error boundaries

**Task F4: Final Polish**
- Responsive design check (mobile-first)
- Keyboard navigation
- Accessibility review (ARIA labels, focus management)
- Performance optimization (lazy loading routes)

---

## Key Implementation Notes

### Dexie Setup Pattern
```typescript
// app/lib/db/index.ts
import Dexie, { Table } from 'dexie';
import { Letter, LetterProgress, PracticeSession, UserSettings } from './schema';

export class LipiDatabase extends Dexie {
  letters!: Table&lt;Letter&gt;;
  letterProgress!: Table&lt;LetterProgress&gt;;
  sessions!: Table&lt;PracticeSession&gt;;
  settings!: Table&lt;UserSettings&gt;;

  constructor() {
    super('lipi-db');
    this.version(1).stores({
      letters: 'id, type, phaseId, lessonId',
      letterProgress: 'letterId, masteryLevel, nextReviewDate',
      sessions: 'id, startedAt, type',
      settings: 'id'
    });
  }
}

export const db = new LipiDatabase();
```

### Seeding Check Pattern
```typescript
// Run on app initialization
export async function ensureSeeded() {
  const count = await db.letters.count();
  if (count === 0) {
    await seedDatabase();
  }
}
```

### Recognition Quiz Logic
```typescript
// Generate wrong answers that are plausibly confusable
function generateDistractors(correctLetter: Letter, allLetters: Letter[]): Letter[] {
  // Prioritize letters from same lesson/phase
  // Or visually similar letters
  // Never repeat the correct answer
}
```

### Matra Display Pattern
For consonants, show all matra combinations in a table:
```
क + ा = का    क + ि = कि    क + ी = की
क + ु = कु    क + ू = कू    क + े = के
क + ै = कै    क + ो = को    क + ौ = कौ
```

---

## Audio Files

Audio files can be sourced from:
1. Generate using text-to-speech (Google Cloud TTS has Hindi)
2. Record manually
3. Use Creative Commons sources

Store in `public/audio/` with naming convention:
- `v-01-a.mp3` (vowel अ)
- `c-01-ka.mp3` (consonant क)
- `w-aam.mp3` (word आम)

For MVP, audio can be optional - the user speaks Hindi already.

---

## Testing Approach

1. **Manual testing** - Primary approach for MVP
2. **Curriculum data validation** - Script to verify all letters have required fields
3. **Database integrity** - Verify foreign keys (letterId references)

---

## Future Enhancements (Post-MVP)

1. **Handwriting recognition** - Use canvas + ML to grade written letters
2. **Sync across devices** - Add optional account with cloud sync
3. **Social features** - Share progress, compete with friends
4. **Custom word lists** - User adds their own vocabulary
5. **Reading mode** - Paste any Hindi text, get word-by-word breakdown
6. **Voice input** - Speak the letter for pronunciation practice

---

## Success Metrics

- User can recognize all 13 vowels after Phase 1
- User can recognize all consonant groups after Phase 2
- User can read simple words after Phase 4
- User can read most Hindi text after Phase 6
- Measured by recognition quiz accuracy &gt;90%
