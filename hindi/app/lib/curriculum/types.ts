// Letter types
export type LetterType = 'vowel' | 'consonant' | 'matra' | 'conjunct' | 'numeral';

// Mastery levels for spaced repetition
export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered';

// Example word with translation
export interface ExampleWord {
  devanagari: string;
  transliteration: string;
  meaning: string;
}

// Stroke instruction for writing practice
export interface StrokeInstruction {
  step: number;
  description: string;
}

// Matra (dependent vowel) form when combined with consonants
export interface MatraForm {
  vowelId: string;
  matra: string;
  position: 'left' | 'right' | 'top' | 'bottom' | 'surrounding';
}

// Main letter interface
export interface Letter {
  id: string;
  devanagari: string;
  transliteration: string;
  pronunciationGuide: string;
  type: LetterType;
  phaseId: number;
  lessonId: number;
  strokeOrder: StrokeInstruction[];
  exampleWords: ExampleWord[];
  matraForm?: string; // For vowels - the dependent form
  baseConsonant?: string; // For conjuncts - primary consonant
  audioUrl?: string;
}

// Lesson within a phase
export interface Lesson {
  id: number;
  phaseId: number;
  title: string;
  description: string;
  letterIds: string[];
}

// Learning phase
export interface Phase {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}
