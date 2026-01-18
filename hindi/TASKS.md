# TASKS.md - Implementation Task Tracker

## How This Works

1. The automation script finds the first `- [ ]` task
2. Claude Code implements it
3. Verification runs (typecheck, build, file existence checks)
4. If verification passes, move to next task
5. If verification fails, retry up to 3 times

---

## Phase A: Foundation

### A1: Install Dependencies
- [x] Run `yarn add dexie dexie-react-hooks`
**Verify**: `grep "dexie" package.json` succeeds

### A2: Set Up Database
- [x] Create `app/lib/db/index.ts` - Dexie database class with tables: letters, letterProgress, sessions, settings. Export the db instance. Add version(1) with proper schema indexes.
**Verify**: File exists, TypeScript compiles

### A3: Create Type Definitions
- [x] Create `app/lib/curriculum/types.ts` with interfaces: Letter, Phase, Lesson, ExampleWord, StrokeInstruction, MatraForm. Create LetterType union and MasteryLevel type. Export all.
**Verify**: File exists, TypeScript compiles

### A4: Create DB Schema Types
- [x] Create `app/lib/db/schema.ts` with interfaces: LetterProgress, PracticeSession, SessionResult, UserSettings.
**Verify**: File exists, TypeScript compiles

### A5: Build Curriculum Data - Phases
- [x] Create `app/lib/curriculum/phases.ts` with all 6 phase definitions including lessons array for each phase.
**Verify**: File exists, exports phases array, TypeScript compiles

### A6: Build Curriculum Data - Vowels
- [x] Create `app/lib/curriculum/vowels.ts` with all 13 vowels (अ आ इ ई उ ऊ ए ऐ ओ औ ऋ) plus अं अः. Each vowel needs: id, devanagari, transliteration, pronunciationGuide, strokeOrder array, exampleWords array (min 2).
**Verify**: File exists, exports vowels array, TypeScript compiles

### A7: Build Curriculum Data - Consonants
- [x] Create `app/lib/curriculum/consonants.ts` with all consonants by group. Velars: क ख ग घ ङ | Palatals: च छ ज झ ञ | Retroflexes: ट ठ ड ढ ण | Dentals: त थ द ध न | Labials: प फ ब भ म | Semi-vowels: य र ल व | Sibilants: श ष स ह | Nuqta: क़ ख़ ग़ ज़ फ़ ड़ ढ़
**Verify**: File exists, exports consonants array, TypeScript compiles

### A8: Build Curriculum Data - Matras
- [x] Create `app/lib/curriculum/matras.ts` with all dependent vowel forms: ा ि ी ु ू े ै ो ौ ृ ं ः ँ ्
**Verify**: File exists, exports matras array, TypeScript compiles

### A9: Build Curriculum Data - Conjuncts
- [x] Create `app/lib/curriculum/conjuncts.ts` with common conjuncts: क्ष त्र ज्ञ श्र क्य स्त प्र क्र ग्र द्य न्द ल्ल
**Verify**: File exists, exports conjuncts array, TypeScript compiles

### A10: Build Curriculum Data - Words
- [x] Create `app/lib/curriculum/words.ts` with 50+ common Hindi words with: devanagari, transliteration, meaning.
**Verify**: File exists, exports words array

### A11: Curriculum Index
- [x] Create `app/lib/curriculum/index.ts` that re-exports all curriculum data and types.
**Verify**: File exists, all exports work

### A12: Database Seeding
- [x] Create `app/lib/db/seed.ts` with async seedDatabase() function. Seed letters table from curriculum. Initialize default UserSettings.
**Verify**: File exists, TypeScript compiles

### A13: Seeding Hook
- [x] Create `app/lib/db/hooks.ts` with useEnsureSeeded hook that seeds on first app load (checks if letters table empty).
**Verify**: File exists, TypeScript compiles

### A14: Wire Up Seeding
- [x] Import and use useEnsureSeeded in root layout or _index route to ensure DB is seeded on app start.
**Verify**: App starts without errors, yarn dev works

---

## Phase B: Core UI Components

### B1: UI Button Component
- [x] Create `app/components/ui/Button.tsx` with variants: primary, secondary, ghost, danger. Props: variant, size, disabled, onClick, children.
**Verify**: File exists, TypeScript compiles

### B2: UI Card and Progress Components
- [x] Create `app/components/ui/Card.tsx` - card wrapper with optional title. Create `app/components/ui/ProgressBar.tsx` - takes value 0-100. Create `app/components/ui/Badge.tsx` - for mastery levels.
**Verify**: Files exist, TypeScript compiles

### B3: UI Modal Component
- [x] Create `app/components/ui/Modal.tsx` - overlay modal with isOpen, onClose, title, children props. Handle escape key and click outside.
**Verify**: File exists, TypeScript compiles

### B4: UI Barrel Export
- [x] Create `app/components/ui/index.ts` barrel export for all UI components.
**Verify**: File exists, exports work

### B5: Layout Header
- [x] Create `app/components/layout/Header.tsx` - app header with title "Lipi" and nav links to Learn, Practice, Reference, Progress.
**Verify**: File exists, TypeScript compiles

### B6: Layout Navigation and Container
- [x] Create `app/components/layout/Navigation.tsx` - bottom nav for mobile. Create `app/components/layout/PageContainer.tsx` - page wrapper with max-width and padding.
**Verify**: Files exist, TypeScript compiles

### B7: Layout Barrel and Integration
- [x] Create `app/components/layout/index.ts` barrel export. Update root layout to use Header component.
**Verify**: App renders with header, no errors

### B8: Letter Card Component
- [x] Create `app/components/letters/LetterCard.tsx` - displays large devanagari, transliteration, pronunciation guide. Props: letter, showTransliteration?, onClick?, mastery?
**Verify**: File exists, TypeScript compiles

### B9: Letter Grid Component
- [x] Create `app/components/letters/LetterGrid.tsx` - grid of LetterCard components. Props: letters array, onLetterClick?. Responsive columns.
**Verify**: File exists, TypeScript compiles

### B10: Stroke Guide Component
- [x] Create `app/components/letters/StrokeGuide.tsx` - numbered list of stroke instructions. Props: strokeOrder array.
**Verify**: File exists, TypeScript compiles

### B11: Letter Components Extras
- [x] Create `app/components/letters/AudioButton.tsx` - placeholder audio play button. Create `app/components/letters/MatraDemo.tsx` - shows consonant + matra combinations. Create `app/components/letters/index.ts` barrel export.
**Verify**: Files exist, TypeScript compiles

---

## Phase C: Curriculum & Learning Routes

### C1: Dashboard Route
- [x] Update `app/routes/_index.tsx` as main dashboard. Show welcome message, current lesson CTA, navigation cards to Learn/Practice/Reference.
**Verify**: Route loads at /, displays content

### C2: Learn Layout Route
- [x] Create `app/routes/learn.tsx` as layout route with Outlet and back navigation.
**Verify**: Route exists, TypeScript compiles

### C3: Learn Index - Phase Overview
- [x] Create `app/routes/learn._index.tsx` - list all 6 phases as cards from curriculum data. Show phase title, description. Link to /learn/$phaseId.
**Verify**: Route loads at /learn, shows phases

### C4: Phase Detail Route
- [x] Create `app/routes/learn.$phaseId.tsx` - load phase by param, display title, description, list lessons. Link lessons to /learn/$phaseId/$lessonId.
**Verify**: Route loads at /learn/1, shows phase and lessons

### C5: Lesson Route
- [x] Create `app/routes/learn.$phaseId.$lessonId.tsx` - load lesson and its letters. Display lesson title, LetterGrid of lesson letters, StrokeGuide for each. Add practice button linking to /practice.
**Verify**: Route loads at /learn/1/1, shows letters

### C6: Reference Layout
- [x] Create `app/routes/reference.tsx` as layout route with Outlet.
**Verify**: Route exists

### C7: Reference Index - Alphabet Grid
- [x] Create `app/routes/reference._index.tsx` - full alphabet LetterGrid. Add filter tabs: All, Vowels, Consonants. Click letter goes to /reference/$letterId.
**Verify**: Route loads at /reference, shows filterable grid

### C8: Letter Detail Route
- [x] Create `app/routes/reference.$letterId.tsx` - load letter by param. Show large display, full details, stroke guide, example words.
**Verify**: Route loads at /reference/v-01, shows letter details

### C9: Curriculum Hooks
- [x] Create `app/hooks/useCurrentLesson.ts`, `app/hooks/useLessonProgress.ts`, `app/hooks/usePhaseProgress.ts` - read from DB, return progress data.
**Verify**: Files exist, TypeScript compiles

---

## Phase D: Practice System

### D1: Practice Layout and Index
- [x] Create `app/routes/practice.tsx` layout. Create `app/routes/practice._index.tsx` - mode selector with Writing Practice and Recognition Quiz cards. Add scope and length selectors.
**Verify**: Routes load at /practice

### D2: Session Generator
- [x] Create `app/lib/practice/session-generator.ts` with generateSession(scope, length, letters) and generateDistractors(correct, all, count) functions.
**Verify**: File exists, TypeScript compiles

### D3: Practice Session Hook
- [x] Create `app/hooks/usePracticeSession.ts` - state for letters, currentIndex, answers. Functions: nextQuestion(), submitAnswer(). Derive: currentLetter, score, progress.
**Verify**: File exists, TypeScript compiles

### D4: Writing Practice Route
- [x] Create `app/routes/practice.write.tsx` - display letter with StrokeGuide, self-assessment buttons (Good/Okay/Struggled), progress bar, session completion.
**Verify**: Route loads, can complete writing session

### D5: Writing Practice Components
- [x] Create `app/components/practice/WritingPrompt.tsx` and `app/components/practice/SessionProgress.tsx`.
**Verify**: Files exist, TypeScript compiles

### D6: Recognition Quiz Route
- [x] Create `app/routes/practice.recognize.tsx` - display letter, 4 multiple choice transliteration options, handle answers, show feedback, auto-advance.
**Verify**: Route loads, quiz works

### D7: Recognition Quiz Components
- [x] Create `app/components/practice/RecognitionCard.tsx` and `app/components/practice/MultipleChoice.tsx`.
**Verify**: Files exist, TypeScript compiles

### D8: Session Complete Component
- [x] Create `app/components/practice/SessionComplete.tsx` - final score, letters needing work, Practice Again and Dashboard buttons.
**Verify**: File exists, displays after session

### D9: Spaced Repetition Logic
- [x] Create `app/lib/practice/spaced-repetition.ts` - calculateNextReview() and getLettersDueForReview() functions. Simple Leitner system.
**Verify**: File exists, TypeScript compiles

### D10: Progress Update Logic
- [x] Create `app/lib/practice/scoring.ts` - updateLetterProgress(). Create `app/lib/db/operations.ts` - saveSession(), updateProgress(). Wire up session saving.
**Verify**: Files exist, session results save to DB

### D11: Practice Components Barrel
- [x] Create `app/components/practice/index.ts` barrel export.
**Verify**: File exists

---

## Phase E: Progress Tracking

### E1: Progress Route
- [x] Create `app/routes/progress.tsx` - display overall stats, mastery distribution, recent sessions.
**Verify**: Route loads at /progress

### E2: Progress Stats Hooks
- [x] Create `app/hooks/useOverallProgress.ts` and `app/hooks/usePracticeStats.ts` - calculate totals, averages, streaks from DB.
**Verify**: Files exist, TypeScript compiles

### E3: Progress Visualization
- [x] Add mastery distribution display (counts per level) and phase progress summary to progress route.
**Verify**: Visualizations render

### E4: Letter Progress List
- [x] Add section showing all learned letters with mastery badge, filter by level, sort options.
**Verify**: List displays with filters

---

## Phase F: Settings & Polish

### F1: Settings Route
- [x] Create `app/routes/settings.tsx` - session length, audio toggle, transliteration toggle. Read/write to DB.
**Verify**: Route loads, settings persist

### F2: Reset Progress
- [x] Add Reset All Progress button with confirmation modal to settings. Clear progress tables on confirm.
**Verify**: Reset works with confirmation

### F3: Settings Hook
- [x] Create `app/hooks/useSettings.ts` - read settings with useLiveQuery, provide updateSetting function.
**Verify**: File exists, TypeScript compiles

### F4: Onboarding Modal
- [x] Create `app/components/onboarding/OnboardingModal.tsx` - 3-step intro shown on first visit. Set onboardingComplete after dismissal.
**Verify**: Modal shows on first visit only

### F5: Empty and Loading States
- [x] Add empty states for progress (no sessions) and practice (no weak letters). Add loading skeletons to data routes.
**Verify**: Empty/loading states display appropriately

### F6: Error Boundary
- [x] Add error boundary to root. Handle 404-like cases for missing letters/phases.
**Verify**: Errors caught gracefully

### F7: Responsive Polish
- [x] Test and fix layout at 375px, 768px, 1024px widths.
**Verify**: App works at all sizes

### F8: Accessibility
- [x] Add aria-labels to buttons, ensure heading hierarchy, test keyboard nav.
**Verify**: Basic a11y requirements met

### F9: Final Build Test
- [x] Run `yarn build` and `yarn start`. Test full user flow end-to-end.
**Verify**: Production build works, flow complete

---

## Completion Log

<!-- Automation will add notes here -->

