import type { LetterProgress } from '../db/schema';
import type { SessionResult } from '../db/schema';
import { updateMasteryLevel, calculateNextReview } from './spaced-repetition';

/**
 * Create or update letter progress based on a practice result
 */
export function updateLetterProgress(
  existing: LetterProgress | undefined,
  result: SessionResult
): LetterProgress {
  const now = new Date();

  if (!existing) {
    // Create new progress entry
    const initialLevel = result.correct ? 'learning' : 'new';
    return {
      letterId: result.letterId,
      masteryLevel: initialLevel,
      correctCount: result.correct ? 1 : 0,
      incorrectCount: result.correct ? 0 : 1,
      lastPracticed: now,
      nextReviewDate: calculateNextReview(initialLevel, now),
      streak: result.correct ? 1 : 0
    };
  }

  // Update existing progress
  const newStreak = result.correct ? existing.streak + 1 : 0;
  const newMasteryLevel = updateMasteryLevel(
    existing.masteryLevel,
    result.correct,
    newStreak
  );

  return {
    letterId: result.letterId,
    masteryLevel: newMasteryLevel,
    correctCount: existing.correctCount + (result.correct ? 1 : 0),
    incorrectCount: existing.incorrectCount + (result.correct ? 0 : 1),
    lastPracticed: now,
    nextReviewDate: calculateNextReview(newMasteryLevel, now),
    streak: newStreak
  };
}

/**
 * Calculate session statistics
 */
export function calculateSessionStats(results: SessionResult[]) {
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.correct).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  const totalResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0);
  const averageResponseTime = totalQuestions > 0 ? totalResponseTime / totalQuestions : 0;

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    accuracy,
    averageResponseTime
  };
}
