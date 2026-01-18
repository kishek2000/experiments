import { useState, useCallback, useMemo } from 'react';
import type { Letter } from '~/lib/curriculum/types';
import type { SessionResult } from '~/lib/db/schema';

export type SelfAssessment = 'good' | 'okay' | 'struggled';

interface UsePracticeSessionOptions {
  letters: Letter[];
  onComplete?: (results: SessionResult[]) => void;
}

export function usePracticeSession({ letters, onComplete }: UsePracticeSessionOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());

  const currentLetter = useMemo(() => {
    return letters[currentIndex] || null;
  }, [letters, currentIndex]);

  const progress = useMemo(() => {
    return letters.length > 0 ? ((currentIndex) / letters.length) * 100 : 0;
  }, [currentIndex, letters.length]);

  const score = useMemo(() => {
    const correct = results.filter(r => r.correct).length;
    return {
      correct,
      total: results.length,
      percentage: results.length > 0 ? (correct / results.length) * 100 : 0
    };
  }, [results]);

  const submitAnswer = useCallback((
    correct: boolean,
    selfAssessment?: SelfAssessment
  ) => {
    const responseTime = Date.now() - questionStartTime;

    const result: SessionResult = {
      letterId: letters[currentIndex].id,
      correct,
      responseTime,
      selfAssessment
    };

    const newResults = [...results, result];
    setResults(newResults);

    // Check if session is complete
    if (currentIndex >= letters.length - 1) {
      setIsComplete(true);
      onComplete?.(newResults);
    } else {
      setCurrentIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentIndex, letters, results, questionStartTime, onComplete]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < letters.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  }, [currentIndex, letters.length]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
    setQuestionStartTime(Date.now());
  }, []);

  const durationSeconds = useMemo(() => {
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  return {
    // State
    currentLetter,
    currentIndex,
    totalQuestions: letters.length,
    results,
    isComplete,
    progress,
    score,
    durationSeconds,

    // Actions
    submitAnswer,
    nextQuestion,
    restart
  };
}
