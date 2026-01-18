import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { allLetters } from '~/lib/curriculum';
import type { MasteryLevel } from '~/lib/curriculum/types';

export function useOverallProgress() {
  const allProgress = useLiveQuery(() => db.letterProgress.toArray());

  if (!allProgress) {
    return {
      totalLetters: allLetters.length,
      learnedLetters: 0,
      masteredLetters: 0,
      progressPercentage: 0,
      masteryDistribution: {
        new: allLetters.length,
        learning: 0,
        familiar: 0,
        mastered: 0
      } as Record<MasteryLevel, number>,
      isLoading: true
    };
  }

  const totalLetters = allLetters.length;
  const progressMap: Record<string, MasteryLevel> = {};

  for (const p of allProgress) {
    progressMap[p.letterId] = p.masteryLevel;
  }

  const masteryDistribution: Record<MasteryLevel, number> = {
    new: 0,
    learning: 0,
    familiar: 0,
    mastered: 0
  };

  for (const letter of allLetters) {
    const level = progressMap[letter.id] || 'new';
    masteryDistribution[level]++;
  }

  const learnedLetters = totalLetters - masteryDistribution.new;
  const masteredLetters = masteryDistribution.mastered;

  return {
    totalLetters,
    learnedLetters,
    masteredLetters,
    progressPercentage: totalLetters > 0 ? (learnedLetters / totalLetters) * 100 : 0,
    masteryDistribution,
    isLoading: false
  };
}
