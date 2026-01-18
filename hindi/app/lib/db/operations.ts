import { db } from './index';
import type { PracticeSession, SessionResult, LetterProgress } from './schema';
import { updateLetterProgress } from '../practice/scoring';

/**
 * Save a practice session and update letter progress
 */
export async function saveSession(
  session: Omit<PracticeSession, 'id'>
): Promise<number> {
  // Save the session
  const sessionId = await db.sessions.add(session as PracticeSession);

  // Update progress for each letter
  await updateProgressFromResults(session.results);

  return sessionId;
}

/**
 * Update letter progress from session results
 */
export async function updateProgressFromResults(
  results: SessionResult[]
): Promise<void> {
  for (const result of results) {
    const existing = await db.letterProgress.get(result.letterId);
    const updated = updateLetterProgress(existing, result);

    if (existing) {
      await db.letterProgress.update(result.letterId, updated);
    } else {
      await db.letterProgress.add(updated);
    }
  }
}

/**
 * Get progress for specific letters
 */
export async function getProgressForLetters(
  letterIds: string[]
): Promise<Record<string, LetterProgress>> {
  const progressList = await db.letterProgress
    .where('letterId')
    .anyOf(letterIds)
    .toArray();

  const progressMap: Record<string, LetterProgress> = {};
  for (const p of progressList) {
    progressMap[p.letterId] = p;
  }

  return progressMap;
}

/**
 * Get recent practice sessions
 */
export async function getRecentSessions(
  limit: number = 10
): Promise<PracticeSession[]> {
  return db.sessions
    .orderBy('date')
    .reverse()
    .limit(limit)
    .toArray();
}

/**
 * Get overall progress statistics
 */
export async function getOverallStats() {
  const allProgress = await db.letterProgress.toArray();
  const allSessions = await db.sessions.toArray();

  const totalLetters = await db.letters.count();
  const learnedLetters = allProgress.filter(p => p.masteryLevel !== 'new').length;
  const masteredLetters = allProgress.filter(p => p.masteryLevel === 'mastered').length;

  const totalSessions = allSessions.length;
  const totalQuestions = allSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
  const totalCorrect = allSessions.reduce((sum, s) => sum + s.totalCorrect, 0);

  return {
    totalLetters,
    learnedLetters,
    masteredLetters,
    totalSessions,
    totalQuestions,
    totalCorrect,
    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
  };
}

/**
 * Reset all progress data
 */
export async function resetAllProgress(): Promise<void> {
  await db.letterProgress.clear();
  await db.sessions.clear();
}
