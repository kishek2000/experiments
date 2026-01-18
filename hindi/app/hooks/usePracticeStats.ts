import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';

export function usePracticeStats() {
  const sessions = useLiveQuery(() => db.sessions.toArray());

  if (!sessions) {
    return {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      totalPracticeTime: 0,
      currentStreak: 0,
      isLoading: true
    };
  }

  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
  const totalCorrect = sessions.reduce((sum, s) => sum + s.totalCorrect, 0);
  const totalPracticeTime = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  // Calculate streak (consecutive days with practice)
  const sortedDates = sessions
    .map(s => new Date(s.date).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates.length > 0) {
    // Check if practiced today or yesterday
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.round(
          (prevDate.getTime() - currDate.getTime()) / 86400000
        );
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    totalSessions,
    totalQuestions,
    totalCorrect,
    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    totalPracticeTime,
    currentStreak,
    isLoading: false
  };
}
