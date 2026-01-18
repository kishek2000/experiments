import type { Letter } from '~/lib/curriculum/types';
import { LetterCard } from '../letters/LetterCard';

interface WritingPromptProps {
  letter: Letter;
  showTransliteration?: boolean;
}

export function WritingPrompt({ letter, showTransliteration = true }: WritingPromptProps) {
  return (
    <div className="flex flex-col items-center">
      <LetterCard letter={letter} size="lg" showTransliteration={showTransliteration} />
      <p className="mt-4 text-gray-600 text-center">
        Write this letter on paper, then assess your attempt
      </p>
    </div>
  );
}
