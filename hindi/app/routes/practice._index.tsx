import { useState } from 'react';
import { Link } from 'react-router';
import { Card, Button } from '~/components/ui';

type PracticeScope = 'current-lesson' | 'current-phase' | 'weak-letters' | 'all';
type SessionLength = 5 | 10 | 15 | 20;

const scopeOptions: { value: PracticeScope; label: string; description: string }[] = [
  { value: 'current-lesson', label: 'Current Lesson', description: 'Practice letters from your current lesson' },
  { value: 'current-phase', label: 'Current Phase', description: 'Practice all letters from your current phase' },
  { value: 'weak-letters', label: 'Weak Letters', description: 'Focus on letters you struggle with' },
  { value: 'all', label: 'All Letters', description: 'Practice from the entire alphabet' }
];

const lengthOptions: SessionLength[] = [5, 10, 15, 20];

export function meta() {
  return [
    { title: 'Practice - Sikho' },
    { name: 'description', content: 'Practice writing and recognizing Hindi letters' }
  ];
}

export default function PracticeIndex() {
  const [scope, setScope] = useState<PracticeScope>('current-lesson');
  const [length, setLength] = useState<SessionLength>(10);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">Practice</h1>
      <p className="text-[--color-text-secondary] mb-8">
        Choose a practice mode and customize your session
      </p>

      {/* Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <Link to={`/practice/write?scope=${scope}&length=${length}`}>
          <Card className="h-full group hover:border-amber-500/40 transition-all duration-300">
            <div className="flex flex-col items-center text-center py-4">
              <div className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/20 mb-4 group-hover:border-amber-500/40 group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-all duration-300">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2 group-hover:text-amber-100 transition-colors">Writing Practice</h3>
              <p className="text-sm text-[--color-text-muted] leading-relaxed">
                See a letter and practice writing it on paper. Self-assess your attempt.
              </p>
            </div>
          </Card>
        </Link>

        <Link to={`/practice/recognize?scope=${scope}&length=${length}`}>
          <Card className="h-full group hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex flex-col items-center text-center py-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl border border-emerald-500/20 mb-4 group-hover:border-emerald-500/40 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all duration-300">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2 group-hover:text-emerald-100 transition-colors">Recognition Quiz</h3>
              <p className="text-sm text-[--color-text-muted] leading-relaxed">
                See a letter and choose the correct transliteration from multiple choices.
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Session Options */}
      <div className="space-y-8">
        {/* Scope Selection */}
        <div>
          <h3 className="text-sm font-semibold text-[--color-text-primary] mb-4 uppercase tracking-wider">What to Practice</h3>
          <div className="grid grid-cols-2 gap-3">
            {scopeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setScope(option.value)}
                className={`p-4 rounded-xl text-left transition-all duration-200 border ${
                  scope === option.value
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-[--color-surface] border-[--color-border] hover:bg-[--color-surface-raised] hover:border-[--color-border-light]'
                }`}
              >
                <div className={`font-medium text-sm mb-1 ${
                  scope === option.value ? 'text-amber-400' : 'text-[--color-text-primary]'
                }`}>
                  {option.label}
                </div>
                <div className="text-xs text-[--color-text-muted] leading-relaxed">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <h3 className="text-sm font-semibold text-[--color-text-primary] mb-4 uppercase tracking-wider">Session Length</h3>
          <div className="flex gap-3">
            {lengthOptions.map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  length === len
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[--color-base] shadow-lg shadow-amber-500/20'
                    : 'bg-[--color-surface] text-[--color-text-secondary] border border-[--color-border] hover:bg-[--color-surface-raised] hover:text-[--color-text-primary]'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
