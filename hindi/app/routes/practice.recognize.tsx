import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { allLetters, getLettersForLesson, getLettersForPhase } from '~/lib/curriculum';
import { generateSession, createMultipleChoiceOptions } from '~/lib/practice/session-generator';
import { usePracticeSession } from '~/hooks/usePracticeSession';
import { LetterCard } from '~/components/letters';
import { Button, ProgressBar } from '~/components/ui';
import { SessionComplete } from '~/components/practice/SessionComplete';
import type { Letter } from '~/lib/curriculum/types';

export function meta() {
  return [
    { title: 'Recognition Quiz - Sikho' }
  ];
}

export default function RecognitionQuiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const scope = searchParams.get('scope') || 'all';
  const length = parseInt(searchParams.get('length') || '10', 10);

  // Get letters based on scope
  const [sessionLetters] = useState(() => {
    let sourceLetters = allLetters;

    switch (scope) {
      case 'current-lesson':
        sourceLetters = getLettersForLesson(1, 1);
        break;
      case 'current-phase':
        sourceLetters = getLettersForPhase(1);
        break;
      case 'weak-letters':
        sourceLetters = allLetters;
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

  const [options, setOptions] = useState<Letter[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generate new options when question changes
  useEffect(() => {
    if (currentLetter) {
      const newOptions = createMultipleChoiceOptions(currentLetter, allLetters, 4);
      setOptions(newOptions);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }, [currentLetter, currentIndex]);

  const handleSelectAnswer = (letter: Letter) => {
    if (showFeedback) return;

    setSelectedAnswer(letter.id);
    setShowFeedback(true);

    const isCorrect = letter.id === currentLetter?.id;

    // Auto-advance after feedback
    setTimeout(() => {
      submitAnswer(isCorrect);
    }, 1000);
  };

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

  return (
    <div className="animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[--color-text-muted] mb-2">
          <span>Recognition Quiz</span>
          <span className="text-[--color-text-secondary]">{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Letter Display */}
      <div className="flex justify-center mb-8">
        <LetterCard letter={currentLetter} size="lg" showTransliteration={false} />
      </div>

      {/* Question */}
      <p className="text-center text-[--color-text-secondary] mb-6">
        What is the transliteration of this letter?
      </p>

      {/* Multiple Choice Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = option.id === currentLetter.id;
          const showCorrect = showFeedback && isCorrect;
          const showWrong = showFeedback && isSelected && !isCorrect;

          let buttonClasses = 'p-4 rounded-xl text-center font-medium transition-all duration-200 border-2 ';

          if (showCorrect) {
            buttonClasses += 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10';
          } else if (showWrong) {
            buttonClasses += 'bg-rose-500/20 border-rose-500 text-rose-400';
          } else if (isSelected) {
            buttonClasses += 'bg-amber-500/20 border-amber-500 text-amber-400';
          } else {
            buttonClasses += 'bg-[--color-surface] border-[--color-border] text-[--color-text-primary] hover:bg-[--color-surface-raised] hover:border-[--color-border-light]';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option)}
              disabled={showFeedback}
              className={buttonClasses}
            >
              <span className="text-lg">{option.transliteration}</span>
              {showCorrect && <span className="ml-2">✓</span>}
              {showWrong && <span className="ml-2">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-xl text-center animate-fade-in ${
          selectedAnswer === currentLetter.id
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
        }`}>
          {selectedAnswer === currentLetter.id ? (
            <p>Correct! Moving to next...</p>
          ) : (
            <p>
              The correct answer is <strong className="text-[--color-text-primary]">{currentLetter.transliteration}</strong>
            </p>
          )}
        </div>
      )}

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
