// Types
export type {
  Letter,
  Phase,
  Lesson,
  ExampleWord,
  StrokeInstruction,
  MatraForm,
  LetterType,
  MasteryLevel
} from './types';

// Curriculum Data
export { phases } from './phases';
export { vowels } from './vowels';
export { consonants } from './consonants';
export { matras } from './matras';
export { conjuncts } from './conjuncts';
export { words } from './words';
export type { Word } from './words';

// Helper to get all letters combined
import { vowels } from './vowels';
import { consonants } from './consonants';
import { matras } from './matras';
import { conjuncts } from './conjuncts';
import type { Letter } from './types';

export const allLetters: Letter[] = [
  ...vowels,
  ...consonants,
  ...matras,
  ...conjuncts
];

// Helper to find a letter by ID
export function getLetterById(id: string): Letter | undefined {
  return allLetters.find(letter => letter.id === id);
}

// Helper to get letters by type
export function getLettersByType(type: Letter['type']): Letter[] {
  return allLetters.filter(letter => letter.type === type);
}

// Helper to get letters for a specific phase and lesson
export function getLettersForLesson(phaseId: number, lessonId: number): Letter[] {
  return allLetters.filter(
    letter => letter.phaseId === phaseId && letter.lessonId === lessonId
  );
}

// Helper to get letters for a specific phase
export function getLettersForPhase(phaseId: number): Letter[] {
  return allLetters.filter(letter => letter.phaseId === phaseId);
}
