import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { getLettersForLesson } from '~/lib/curriculum';
import type { MasteryLevel } from '~/lib/curriculum/types';

export function useLessonProgress(phaseId: number, lessonId: number) {
  const lessonLetters = getLettersForLesson(phaseId, lessonId);
  const letterIds = lessonLetters.map(l => l.id);

  const progress = useLiveQuery(
    () => db.letterProgress.where('letterId').anyOf(letterIds).toArray(),
    [phaseId, lessonId]
  );

  if (!progress) {
    return {
      totalLetters: lessonLetters.length,
      learnedLetters: 0,
      masteredLetters: 0,
      progressPercentage: 0,
      masteryMap: {} as Record<string, MasteryLevel>,
      isLoading: true
    };
  }

  const masteryMap: Record<string, MasteryLevel> = {};
  let learnedCount = 0;
  let masteredCount = 0;

  for (const p of progress) {
    masteryMap[p.letterId] = p.masteryLevel;
    if (p.masteryLevel !== 'new') {
      learnedCount++;
    }
    if (p.masteryLevel === 'mastered') {
      masteredCount++;
    }
  }

  // Letters without progress entries are 'new'
  for (const letter of lessonLetters) {
    if (!masteryMap[letter.id]) {
      masteryMap[letter.id] = 'new';
    }
  }

  return {
    totalLetters: lessonLetters.length,
    learnedLetters: learnedCount,
    masteredLetters: masteredCount,
    progressPercentage: lessonLetters.length > 0
      ? (learnedCount / lessonLetters.length) * 100
      : 0,
    masteryMap,
    isLoading: false
  };
}
