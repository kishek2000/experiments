import { db } from './index';
import { allLetters } from '../curriculum';
import type { UserSettings } from './schema';

const DEFAULT_SETTINGS: UserSettings = {
  id: 'user',
  sessionLength: 10,
  showTransliteration: true,
  audioEnabled: false,
  onboardingComplete: false,
  currentPhaseId: 1,
  currentLessonId: 1
};

export async function seedDatabase(): Promise<void> {
  // Check if already seeded by looking for any letters
  const existingLetters = await db.letters.count();

  if (existingLetters > 0) {
    // Already seeded
    return;
  }

  // Seed letters
  await db.letters.bulkAdd(allLetters);

  // Initialize default settings
  const existingSettings = await db.settings.get('user');
  if (!existingSettings) {
    await db.settings.add(DEFAULT_SETTINGS);
  }
}

export async function resetDatabase(): Promise<void> {
  // Clear all tables
  await db.letters.clear();
  await db.letterProgress.clear();
  await db.sessions.clear();
  await db.settings.clear();

  // Re-seed
  await seedDatabase();
}
