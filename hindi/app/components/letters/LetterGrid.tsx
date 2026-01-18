import type { Letter, MasteryLevel } from '~/lib/curriculum/types';
import { LetterCard } from './LetterCard';

interface LetterGridProps {
  letters: Letter[];
  onLetterClick?: (letter: Letter) => void;
  showTransliteration?: boolean;
  masteryMap?: Record<string, MasteryLevel>;
  size?: 'sm' | 'md' | 'lg';
}

export function LetterGrid({
  letters,
  onLetterClick,
  showTransliteration = true,
  masteryMap,
  size = 'sm'
}: LetterGridProps) {
  if (letters.length === 0) {
    return (
      <div className="text-center py-12 text-[--color-text-muted]">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        No letters to display
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {letters.map((letter, index) => (
        <div 
          key={letter.id} 
          className="animate-fade-in opacity-0"
          style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
        >
          <LetterCard
            letter={letter}
            showTransliteration={showTransliteration}
            onClick={onLetterClick ? () => onLetterClick(letter) : undefined}
            mastery={masteryMap?.[letter.id]}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}
