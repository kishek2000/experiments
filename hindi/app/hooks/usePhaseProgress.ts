import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { phases, getLettersForPhase } from '~/lib/curriculum';
import type { MasteryLevel } from '~/lib/curriculum/types';

export function usePhaseProgress(phaseId: number) {
  const phase = phases.find(p => p.id === phaseId);
  const phaseLetters = getLettersForPhase(phaseId);
  const letterIds = phaseLetters.map(l => l.id);

  const progress = useLiveQuery(
    () => db.letterProgress.where('letterId').anyOf(letterIds).toArray(),
    [phaseId]
  );

  if (!phase || !progress) {
    return {
      phase,
      totalLetters: phaseLetters.length,
      totalLessons: phase?.lessons.length || 0,
      completedLessons: 0,
      learnedLetters: 0,
      masteredLetters: 0,
      progressPercentage: 0,
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

  // Calculate completed lessons (all letters in lesson are at least 'familiar')
  let completedLessons = 0;
  for (const lesson of phase.lessons) {
    const lessonLetterIds = lesson.letterIds;
    const allFamiliar = lessonLetterIds.every(
      id => masteryMap[id] === 'familiar' || masteryMap[id] === 'mastered'
    );
    if (allFamiliar && lessonLetterIds.length > 0) {
      completedLessons++;
    }
  }

  return {
    phase,
    totalLetters: phaseLetters.length,
    totalLessons: phase.lessons.length,
    completedLessons,
    learnedLetters: learnedCount,
    masteredLetters: masteredCount,
    progressPercentage: phaseLetters.length > 0
      ? (learnedCount / phaseLetters.length) * 100
      : 0,
    isLoading: false
  };
}
