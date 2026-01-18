import Dexie, { type Table } from 'dexie';
import type { Letter } from '../curriculum/types';
import type { LetterProgress, PracticeSession, UserSettings } from './schema';

export class SikhoDatabase extends Dexie {
  letters!: Table<Letter>;
  letterProgress!: Table<LetterProgress>;
  sessions!: Table<PracticeSession>;
  settings!: Table<UserSettings>;

  constructor() {
    super('sikho');

    this.version(1).stores({
      // Letters table - indexed by id, type, and phaseId for filtering
      letters: 'id, type, phaseId, lessonId',
      // Progress tracking - indexed by letterId and masteryLevel for queries
      letterProgress: 'letterId, masteryLevel, nextReviewDate',
      // Practice sessions - indexed by date for history queries
      sessions: '++id, date, type',
      // User settings - single record with id
      settings: 'id'
    });
  }
}

export const db = new SikhoDatabase();
