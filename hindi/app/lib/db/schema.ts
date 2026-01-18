import type { MasteryLevel } from '../curriculum/types';

// Progress tracking for individual letters
export interface LetterProgress {
  letterId: string;
  masteryLevel: MasteryLevel;
  correctCount: number;
  incorrectCount: number;
  lastPracticed: Date | null;
  nextReviewDate: Date | null;
  streak: number;
}

// Individual result within a session
export interface SessionResult {
  letterId: string;
  correct: boolean;
  responseTime?: number; // milliseconds
  selfAssessment?: 'good' | 'okay' | 'struggled';
}

// Practice session record
export interface PracticeSession {
  id?: number;
  date: Date;
  type: 'writing' | 'recognition';
  scope: 'current-lesson' | 'current-phase' | 'weak-letters' | 'all';
  results: SessionResult[];
  totalCorrect: number;
  totalQuestions: number;
  durationSeconds: number;
}

// User settings
export interface UserSettings {
  id: string; // Always 'user' for single user
  sessionLength: number; // Number of questions per session
  showTransliteration: boolean;
  audioEnabled: boolean;
  onboardingComplete: boolean;
  currentPhaseId: number;
  currentLessonId: number;
}
