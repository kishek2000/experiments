import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { resetAllProgress } from '~/lib/db/operations';
import { PageContainer } from '~/components/layout';
import { Card, Button, Modal } from '~/components/ui';

export function meta() {
  return [
    { title: 'Settings - Sikho' },
    { name: 'description', content: 'App settings' }
  ];
}

export default function SettingsPage() {
  const settings = useLiveQuery(() => db.settings.get('user'));
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!settings) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[--color-text-muted]">Loading settings...</p>
        </div>
      </PageContainer>
    );
  }

  const updateSetting = async <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    await db.settings.update('user', { [key]: value });
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetAllProgress();
      setShowResetModal(false);
    } catch (error) {
      console.error('Failed to reset progress:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <PageContainer>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">Settings</h1>
        <p className="text-[--color-text-secondary] mb-8">Customize your learning experience</p>

        <div className="space-y-6">
          {/* Session Length */}
          <Card title="Practice Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[--color-text-primary] mb-3">
                  Default Session Length
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((length) => (
                    <button
                      key={length}
                      onClick={() => updateSetting('sessionLength', length)}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        settings.sessionLength === length
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[--color-base] shadow-lg shadow-amber-500/20'
                          : 'bg-[--color-surface-elevated] text-[--color-text-secondary] border border-[--color-border] hover:bg-[--color-surface-raised] hover:text-[--color-text-primary]'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-[--color-text-muted] mt-2">
                  Number of questions per practice session
                </p>
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card title="Display Settings">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[--color-text-primary]">Show Transliteration</p>
                  <p className="text-sm text-[--color-text-muted]">
                    Display romanized text below Devanagari letters
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('showTransliteration', !settings.showTransliteration)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${
                    settings.showTransliteration 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                      : 'bg-[--color-surface-elevated]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                      settings.showTransliteration ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[--color-text-primary]">Audio Enabled</p>
                  <p className="text-sm text-[--color-text-muted]">
                    Play pronunciation audio (coming soon)
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('audioEnabled', !settings.audioEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${
                    settings.audioEnabled 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                      : 'bg-[--color-surface-elevated]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                      settings.audioEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card title="Data Management">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[--color-text-primary]">Reset All Progress</p>
                  <p className="text-sm text-[--color-text-muted]">
                    Clear all practice history and start fresh
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowResetModal(true)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card title="About">
            <div className="text-sm text-[--color-text-secondary] space-y-2">
              <p><span className="text-amber-400 font-semibold">Sikho</span> - Learn Hindi Script</p>
              <p className="text-[--color-text-muted]">A free app to help you learn reading and writing Devanagari.</p>
              <p className="text-[--color-text-muted] opacity-60">Version 1.0.0</p>
            </div>
          </Card>
        </div>

        {/* Reset Confirmation Modal */}
        <Modal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          title="Reset All Progress?"
        >
          <div className="space-y-4">
            <p className="text-[--color-text-secondary]">
              This will permanently delete all your practice history and progress. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReset}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Reset Everything'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </PageContainer>
  );
}
