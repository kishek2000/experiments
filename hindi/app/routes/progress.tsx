import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';
import { allLetters } from '~/lib/curriculum';
import { PageContainer } from '~/components/layout';
import { Card, ProgressBar, Badge } from '~/components/ui';
import type { MasteryLevel } from '~/lib/curriculum/types';

export function meta() {
  return [
    { title: 'Progress - Sikho' },
    { name: 'description', content: 'Track your learning progress' }
  ];
}

export default function ProgressPage() {
  const allProgress = useLiveQuery(() => db.letterProgress.toArray());
  const recentSessions = useLiveQuery(() =>
    db.sessions.orderBy('date').reverse().limit(5).toArray()
  );

  if (!allProgress || !recentSessions) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[--color-text-muted]">Loading progress...</p>
        </div>
      </PageContainer>
    );
  }

  // Calculate stats
  const totalLetters = allLetters.length;
  const progressMap: Record<string, MasteryLevel> = {};
  for (const p of allProgress) {
    progressMap[p.letterId] = p.masteryLevel;
  }

  const masteryDistribution: Record<MasteryLevel, number> = {
    new: 0,
    learning: 0,
    familiar: 0,
    mastered: 0
  };

  for (const letter of allLetters) {
    const level = progressMap[letter.id] || 'new';
    masteryDistribution[level]++;
  }

  const learnedLetters = totalLetters - masteryDistribution.new;
  const overallProgress = (learnedLetters / totalLetters) * 100;

  const totalSessions = recentSessions.length;
  const totalQuestions = recentSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
  const totalCorrect = recentSessions.reduce((sum, s) => sum + s.totalCorrect, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  return (
    <PageContainer>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">Your Progress</h1>
        <p className="text-[--color-text-secondary] mb-8">Track your learning journey</p>

        {/* Overall Stats */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-sky-500/10 rounded-3xl blur-xl opacity-60" />
          
          <Card className="relative" variant="elevated">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-[--color-text-muted] mb-2 uppercase tracking-wider font-medium">Letters Learned</p>
                <p className="text-4xl font-bold text-[--color-text-primary] mb-1">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">{learnedLetters}</span>
                  <span className="text-lg text-[--color-text-muted] font-normal">/{totalLetters}</span>
                </p>
                <ProgressBar value={overallProgress} className="mt-3" />
              </div>
              <div>
                <p className="text-sm text-[--color-text-muted] mb-2 uppercase tracking-wider font-medium">Overall Accuracy</p>
                <p className="text-4xl font-bold mb-1">
                  <span className={`${
                    overallAccuracy >= 70 
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                      : overallAccuracy >= 50 
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                        : 'bg-gradient-to-r from-rose-400 to-rose-500'
                  } bg-clip-text text-transparent`}>
                    {Math.round(overallAccuracy)}%
                  </span>
                </p>
                <p className="text-sm text-[--color-text-muted] mt-3">
                  {totalCorrect}/{totalQuestions} correct answers
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Mastery Distribution */}
        <Card title="Mastery Distribution" className="mb-6">
          <div className="space-y-4">
            {(['mastered', 'familiar', 'learning', 'new'] as MasteryLevel[]).map((level) => {
              const count = masteryDistribution[level];
              const percentage = (count / totalLetters) * 100;
              const colors: Record<MasteryLevel, string> = {
                mastered: 'from-emerald-500 to-emerald-400',
                familiar: 'from-sky-500 to-sky-400',
                learning: 'from-amber-500 to-amber-400',
                new: 'from-[--color-text-muted] to-[--color-text-muted]'
              };

              return (
                <div key={level} className="flex items-center gap-4">
                  <Badge level={level} className="w-24" />
                  <div className="flex-1">
                    <div className="h-3 bg-[--color-surface-elevated] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[level]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-[--color-text-secondary] w-12 text-right font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card title="Recent Sessions">
          {recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto mb-3 text-[--color-text-muted] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[--color-text-muted]">
                No practice sessions yet. Start practicing to see your history!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentSessions.map((session) => {
                const accuracy = session.totalQuestions > 0
                  ? (session.totalCorrect / session.totalQuestions) * 100
                  : 0;
                const date = new Date(session.date);

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-3 border-b border-[--color-border] last:border-0 hover:bg-[--color-surface-raised] -mx-5 px-5 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-[--color-text-primary] capitalize">
                        {session.type} Practice
                      </p>
                      <p className="text-sm text-[--color-text-muted]">
                        {date.toLocaleDateString()} • {session.totalQuestions} questions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        accuracy >= 70 
                          ? 'text-emerald-400' 
                          : accuracy >= 50 
                            ? 'text-amber-400' 
                            : 'text-rose-400'
                      }`}>
                        {Math.round(accuracy)}%
                      </p>
                      <p className="text-sm text-[--color-text-muted]">
                        {session.totalCorrect}/{session.totalQuestions}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </PageContainer>
  );
}
