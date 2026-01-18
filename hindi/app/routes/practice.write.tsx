import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { allLetters, getLettersForLesson, getLettersForPhase } from '~/lib/curriculum';
import { generateSession } from '~/lib/practice/session-generator';
import { usePracticeSession, type SelfAssessment } from '~/hooks/usePracticeSession';
import { LetterCard, StrokeGuide } from '~/components/letters';
import { Button, ProgressBar, Card } from '~/components/ui';
import { SessionComplete } from '~/components/practice/SessionComplete';

export function meta() {
  return [
    { title: 'Writing Practice - Sikho' }
  ];
}

export default function WritingPractice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const scope = searchParams.get('scope') || 'all';
  const length = parseInt(searchParams.get('length') || '10', 10);

  // Get letters based on scope
  const [sessionLetters] = useState(() => {
    let sourceLetters = allLetters;

    switch (scope) {
      case 'current-lesson':
        sourceLetters = getLettersForLesson(1, 1); // TODO: Get from settings
        break;
      case 'current-phase':
        sourceLetters = getLettersForPhase(1); // TODO: Get from settings
        break;
      case 'weak-letters':
        sourceLetters = allLetters; // TODO: Get weak letters from progress
        break;
      default:
        sourceLetters = allLetters;
    }

    return generateSession(sourceLetters, length);
  });

  const {
    currentLetter,
    currentIndex,
    totalQuestions,
    isComplete,
    progress,
    score,
    results,
    durationSeconds,
    submitAnswer,
    restart
  } = usePracticeSession({
    letters: sessionLetters
  });

  const [showStroke, setShowStroke] = useState(false);

  useEffect(() => {
    setShowStroke(false);
  }, [currentIndex]);

  if (isComplete) {
    return (
      <SessionComplete
        score={score}
        results={results}
        letters={sessionLetters}
        durationSeconds={durationSeconds}
        onPracticeAgain={restart}
        onGoHome={() => navigate('/')}
      />
    );
  }

  if (!currentLetter) {
    return (
      <div className="text-center py-12">
        <p className="text-[--color-text-muted]">No letters available for practice.</p>
        <Button onClick={() => navigate('/practice')} className="mt-4">
          Back to Practice
        </Button>
      </div>
    );
  }

  const handleAssessment = (assessment: SelfAssessment) => {
    submitAnswer(assessment !== 'struggled', assessment);
  };

  return (
    <div className="animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[--color-text-muted] mb-2">
          <span>Writing Practice</span>
          <span className="text-[--color-text-secondary]">{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Letter Display */}
      <div className="flex justify-center mb-8">
        <LetterCard letter={currentLetter} size="lg" showTransliteration />
      </div>

      {/* Instruction */}
      <Card className="mb-6 text-center">
        <p className="text-[--color-text-secondary]">
          Write this letter on paper, then assess how it went.
        </p>
      </Card>

      {/* Stroke Guide Toggle */}
      <div className="mb-8">
        <button
          onClick={() => setShowStroke(!showStroke)}
          className="w-full py-3 text-sm text-amber-400 hover:text-amber-300 flex items-center justify-center gap-2 bg-[--color-surface] rounded-xl border border-[--color-border] hover:border-amber-500/30 transition-all"
        >
          {showStroke ? 'Hide' : 'Show'} Stroke Guide
          <svg
            className={`w-4 h-4 transition-transform ${showStroke ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showStroke && (
          <div className="mt-4 animate-fade-in">
            <StrokeGuide strokeOrder={currentLetter.strokeOrder} />
          </div>
        )}
      </div>

      {/* Self Assessment Buttons */}
      <div className="space-y-4">
        <p className="text-center text-sm text-[--color-text-muted] mb-4">How did your writing go?</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleAssessment('good')}
            className="flex flex-col items-center py-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all active:scale-95"
          >
            <span className="text-2xl mb-1">✓</span>
            <span className="font-medium">Good</span>
          </button>
          <button
            onClick={() => handleAssessment('okay')}
            className="flex flex-col items-center py-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all active:scale-95"
          >
            <span className="text-2xl mb-1">~</span>
            <span className="font-medium">Okay</span>
          </button>
          <button
            onClick={() => handleAssessment('struggled')}
            className="flex flex-col items-center py-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all active:scale-95"
          >
            <span className="text-2xl mb-1">✗</span>
            <span className="font-medium">Struggled</span>
          </button>
        </div>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
