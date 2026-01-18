import type { Letter } from '~/lib/curriculum/types';
import type { SessionResult } from '~/lib/db/schema';
import { Button, Card, ProgressBar } from '../ui';
import { LetterCard } from '../letters/LetterCard';

interface SessionCompleteProps {
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  results: SessionResult[];
  letters: Letter[];
  durationSeconds: number;
  onPracticeAgain: () => void;
  onGoHome: () => void;
}

export function SessionComplete({
  score,
  results,
  letters,
  durationSeconds,
  onPracticeAgain,
  onGoHome
}: SessionCompleteProps) {
  const incorrectResults = results.filter(r => !r.correct);
  const incorrectLetters = incorrectResults
    .map(r => letters.find(l => l.id === r.letterId))
    .filter((l): l is Letter => l !== undefined);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getScoreMessage = () => {
    if (score.percentage >= 90) return 'Excellent work!';
    if (score.percentage >= 70) return 'Good job!';
    if (score.percentage >= 50) return 'Keep practicing!';
    return 'Keep going, you\'ll get better!';
  };

  const getScoreColor = (): 'emerald' | 'amber' | 'rose' => {
    if (score.percentage >= 90) return 'emerald';
    if (score.percentage >= 70) return 'amber';
    return 'rose';
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">Session Complete!</h1>
        <p className="text-[--color-text-secondary]">{getScoreMessage()}</p>
      </div>

      {/* Score Card */}
      <Card className="mb-6" variant="elevated">
        <div className="text-center py-4">
          <div className="text-5xl font-bold mb-3">
            <span className={`${
              score.percentage >= 70 
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                : score.percentage >= 50 
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-rose-400 to-rose-500'
            } bg-clip-text text-transparent`}>
              {score.correct}/{score.total}
            </span>
          </div>
          <ProgressBar
            value={score.percentage}
            color={getScoreColor()}
            className="max-w-xs mx-auto mb-3"
          />
          <p className="text-[--color-text-secondary]">{Math.round(score.percentage)}% correct</p>
        </div>

        <div className="flex justify-center gap-8 pt-4 border-t border-[--color-border] mt-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-emerald-400">{score.correct}</div>
            <div className="text-sm text-[--color-text-muted]">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-rose-400">{score.total - score.correct}</div>
            <div className="text-sm text-[--color-text-muted]">Incorrect</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-[--color-text-primary]">{formatDuration(durationSeconds)}</div>
            <div className="text-sm text-[--color-text-muted]">Duration</div>
          </div>
        </div>
      </Card>

      {/* Letters Needing Work */}
      {incorrectLetters.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-[--color-text-primary] mb-3">Letters to Review</h2>
          <div className="grid grid-cols-4 gap-2">
            {incorrectLetters.map((letter) => (
              <LetterCard key={letter.id} letter={letter} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button onClick={onPracticeAgain} size="lg" className="w-full">
          Practice Again
        </Button>
        <Button onClick={onGoHome} variant="secondary" size="lg" className="w-full">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
