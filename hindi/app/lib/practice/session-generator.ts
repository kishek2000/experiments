import type { Letter } from '../curriculum/types';

export type PracticeScope = 'current-lesson' | 'current-phase' | 'weak-letters' | 'all';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a practice session with the specified number of letters
 */
export function generateSession(
  letters: Letter[],
  length: number
): Letter[] {
  if (letters.length === 0) {
    return [];
  }

  // If we have fewer letters than requested, repeat letters
  if (letters.length < length) {
    const repeated: Letter[] = [];
    while (repeated.length < length) {
      repeated.push(...shuffleArray(letters));
    }
    return repeated.slice(0, length);
  }

  // Shuffle and take the requested number
  return shuffleArray(letters).slice(0, length);
}

/**
 * Generates distractor options for multiple choice questions
 * Returns an array of letters that does NOT include the correct answer
 */
export function generateDistractors(
  correct: Letter,
  allLetters: Letter[],
  count: number
): Letter[] {
  // Filter out the correct answer and prefer letters of the same type
  const sameType = allLetters.filter(
    l => l.id !== correct.id && l.type === correct.type
  );
  const differentType = allLetters.filter(
    l => l.id !== correct.id && l.type !== correct.type
  );

  // Prioritize same type distractors for harder questions
  const shuffledSameType = shuffleArray(sameType);
  const shuffledDifferentType = shuffleArray(differentType);

  const distractors: Letter[] = [];

  // First, add same type letters
  for (const letter of shuffledSameType) {
    if (distractors.length >= count) break;
    distractors.push(letter);
  }

  // If not enough same type, add different type
  for (const letter of shuffledDifferentType) {
    if (distractors.length >= count) break;
    distractors.push(letter);
  }

  return distractors;
}

/**
 * Creates multiple choice options including the correct answer and distractors
 * Returns shuffled array of options
 */
export function createMultipleChoiceOptions(
  correct: Letter,
  allLetters: Letter[],
  totalOptions: number = 4
): Letter[] {
  const distractors = generateDistractors(correct, allLetters, totalOptions - 1);
  return shuffleArray([correct, ...distractors]);
}
