import { useState } from 'react';
import { Link } from 'react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { PageContainer } from '~/components/layout';
import { Card, Button } from '~/components/ui';
import { OnboardingModal } from '~/components/onboarding/OnboardingModal';
import { useCurrentLesson } from '~/hooks/useCurrentLesson';

export function meta() {
  return [
    { title: 'Sikho - Learn Hindi Script' },
    { name: 'description', content: 'Learn to read and write Devanagari script' }
  ];
}

export default function Dashboard() {
  const settings = useLiveQuery(() => db.settings.get('user'));
  const { phase, lesson } = useCurrentLesson();
  const [showOnboarding, setShowOnboarding] = useState(true);

  const shouldShowOnboarding = settings && !settings.onboardingComplete && showOnboarding;

  return (
    <PageContainer>
      {/* Onboarding Modal */}
      {shouldShowOnboarding && (
        <OnboardingModal
          isOpen={true}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

      {/* Welcome Section */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[--color-text-primary] via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Welcome to Sikho
          </span>
        </h1>
        <p className="text-[--color-text-secondary] text-lg">
          Master the art of reading and writing Devanagari script
        </p>
      </div>

      {/* Current Lesson CTA */}
      <div className="animate-fade-in stagger-1 opacity-0 mb-10">
        <div className="relative group">
          {/* Glow effect behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-rose-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Card className="relative bg-gradient-to-br from-[--color-surface-raised] to-[--color-surface] border-amber-500/20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative text-center py-6">
              <p className="text-amber-400/80 text-sm font-medium tracking-wider uppercase mb-2">
                Continue Learning
              </p>
              <h2 className="text-3xl font-bold text-[--color-text-primary] mb-2 devanagari">
                {phase.title}
              </h2>
              <p className="text-[--color-text-secondary] mb-6">{lesson.title}</p>
              <Link to={`/learn/${phase.id}/${lesson.id}`}>
                <Button size="lg" className="min-w-[200px]">
                  Start Lesson
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link to="/learn" className="animate-fade-in stagger-2 opacity-0">
          <Card className="h-full group hover:border-amber-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[--color-text-primary] mb-1 group-hover:text-amber-100 transition-colors">Learn</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">
                  Study letters through structured lessons with stroke guides and examples
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/practice" className="animate-fade-in stagger-3 opacity-0">
          <Card className="h-full group hover:border-emerald-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[--color-text-primary] mb-1 group-hover:text-emerald-100 transition-colors">Practice</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">
                  Test your knowledge with writing practice and recognition quizzes
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reference" className="animate-fade-in stagger-4 opacity-0">
          <Card className="h-full group hover:border-sky-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-sky-500/20 to-sky-600/10 rounded-xl border border-sky-500/20 group-hover:border-sky-500/40 transition-colors">
                <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[--color-text-primary] mb-1 group-hover:text-sky-100 transition-colors">Reference</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">
                  Browse the complete alphabet with detailed information for each letter
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/progress" className="animate-fade-in stagger-4 opacity-0">
          <Card className="h-full group hover:border-rose-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-rose-500/20 to-rose-600/10 rounded-xl border border-rose-500/20 group-hover:border-rose-500/40 transition-colors">
                <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[--color-text-primary] mb-1 group-hover:text-rose-100 transition-colors">Progress</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">
                  Track your learning journey and see which letters need more practice
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </PageContainer>
  );
}
