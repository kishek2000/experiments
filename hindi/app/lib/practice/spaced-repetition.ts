import type { MasteryLevel } from '../curriculum/types';
import type { LetterProgress } from '../db/schema';

// Leitner system intervals (in days)
const INTERVALS: Record<MasteryLevel, number> = {
  new: 0,
  learning: 1,
  familiar: 3,
  mastered: 7
};

/**
 * Calculate the next review date based on mastery level
 */
export function calculateNextReview(
  masteryLevel: MasteryLevel,
  lastPracticed: Date
): Date {
  const intervalDays = INTERVALS[masteryLevel];
  const nextReview = new Date(lastPracticed);
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview;
}

/**
 * Update mastery level based on practice result
 */
export function updateMasteryLevel(
  currentLevel: MasteryLevel,
  wasCorrect: boolean,
  streak: number
): MasteryLevel {
  if (wasCorrect) {
    // Progress through levels with consecutive correct answers
    if (currentLevel === 'new' && streak >= 1) {
      return 'learning';
    }
    if (currentLevel === 'learning' && streak >= 3) {
      return 'familiar';
    }
    if (currentLevel === 'familiar' && streak >= 5) {
      return 'mastered';
    }
    return currentLevel;
  } else {
    // Regress on incorrect answers
    if (currentLevel === 'mastered') {
      return 'familiar';
    }
    if (currentLevel === 'familiar') {
      return 'learning';
    }
    return currentLevel;
  }
}

/**
 * Get letters that are due for review
 */
export function getLettersDueForReview(
  allProgress: LetterProgress[],
  now: Date = new Date()
): LetterProgress[] {
  return allProgress.filter(progress => {
    // New letters are always due
    if (progress.masteryLevel === 'new') {
      return true;
    }

    // Check if review date has passed
    if (progress.nextReviewDate) {
      return new Date(progress.nextReviewDate) <= now;
    }

    // Letters without a review date are due
    return true;
  });
}

/**
 * Sort letters by review priority (most urgent first)
 */
export function sortByReviewPriority(progress: LetterProgress[]): LetterProgress[] {
  return [...progress].sort((a, b) => {
    // New letters first
    if (a.masteryLevel === 'new' && b.masteryLevel !== 'new') return -1;
    if (b.masteryLevel === 'new' && a.masteryLevel !== 'new') return 1;

    // Then by next review date (earliest first)
    const aDate = a.nextReviewDate ? new Date(a.nextReviewDate).getTime() : 0;
    const bDate = b.nextReviewDate ? new Date(b.nextReviewDate).getTime() : 0;
    return aDate - bDate;
  });
}

/**
 * Get letters that the user is struggling with
 */
export function getWeakLetters(
  allProgress: LetterProgress[],
  threshold: number = 0.5
): LetterProgress[] {
  return allProgress.filter(progress => {
    const total = progress.correctCount + progress.incorrectCount;
    if (total === 0) return false;

    const accuracy = progress.correctCount / total;
    return accuracy < threshold;
  });
}
