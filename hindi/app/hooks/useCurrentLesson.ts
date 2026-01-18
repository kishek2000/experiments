import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { phases, getLettersForLesson } from '~/lib/curriculum';

export function useCurrentLesson() {
  const settings = useLiveQuery(() => db.settings.get('user'));

  if (!settings) {
    return {
      phase: phases[0],
      lesson: phases[0].lessons[0],
      letters: getLettersForLesson(1, 1),
      isLoading: true
    };
  }

  const phase = phases.find(p => p.id === settings.currentPhaseId) || phases[0];
  const lesson = phase.lessons.find(l => l.id === settings.currentLessonId) || phase.lessons[0];
  const letters = getLettersForLesson(phase.id, lesson.id);

  return {
    phase,
    lesson,
    letters,
    isLoading: false
  };
}
