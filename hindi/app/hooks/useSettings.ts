import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import type { UserSettings } from '~/lib/db/schema';

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.get('user'));

  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    await db.settings.update('user', { [key]: value });
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    await db.settings.update('user', updates);
  };

  return {
    settings,
    updateSetting,
    updateSettings,
    isLoading: settings === undefined
  };
}
