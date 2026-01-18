import { Link } from 'react-router';
import { phases } from '~/lib/curriculum';
import { Card, ProgressBar } from '~/components/ui';

export function meta() {
  return [
    { title: 'Learn - Sikho' },
    { name: 'description', content: 'Choose a phase to start learning Hindi script' }
  ];
}

export default function LearnIndex() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">Learn Devanagari</h1>
      <p className="text-[--color-text-secondary] mb-8">
        Progress through 6 phases to master reading and writing Hindi script
      </p>

      <div className="space-y-4">
        {phases.map((phase, index) => {
          const totalLessons = phase.lessons.length;
          const completedLessons = 0; // TODO: Get from progress
          const progress = (completedLessons / totalLessons) * 100;
          const isActive = index === 0; // First phase is active by default

          return (
            <Link key={phase.id} to={`/learn/${phase.id}`} className={`block animate-fade-in stagger-${Math.min(index + 1, 4)} opacity-0`}>
              <Card className={`group transition-all duration-300 ${
                isActive 
                  ? 'hover:border-amber-500/40' 
                  : 'hover:border-[--color-border-light]'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 group-hover:border-amber-500/50'
                      : 'bg-[--color-surface-elevated] border border-[--color-border]'
                  }`}>
                    <span className={`text-xl font-bold ${
                      isActive ? 'text-amber-400' : 'text-[--color-text-muted]'
                    }`}>{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[--color-text-primary] mb-1 group-hover:text-amber-100 transition-colors">{phase.title}</h3>
                    <p className="text-sm text-[--color-text-muted] mb-3 leading-relaxed">{phase.description}</p>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={progress} className="flex-1" color={isActive ? 'amber' : 'sky'} size="sm" />
                      <span className="text-xs text-[--color-text-muted] whitespace-nowrap">
                        {completedLessons}/{totalLessons} lessons
                      </span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-[--color-text-muted] flex-shrink-0 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
