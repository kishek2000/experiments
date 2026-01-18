import type { Letter, MasteryLevel } from '~/lib/curriculum/types';
import { Badge } from '../ui/Badge';

interface LetterCardProps {
  letter: Letter;
  showTransliteration?: boolean;
  onClick?: () => void;
  mastery?: MasteryLevel;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    card: 'p-3',
    devanagari: 'text-3xl',
    transliteration: 'text-xs'
  },
  md: {
    card: 'p-5',
    devanagari: 'text-5xl',
    transliteration: 'text-sm'
  },
  lg: {
    card: 'p-8',
    devanagari: 'text-7xl',
    transliteration: 'text-base'
  }
};

export function LetterCard({
  letter,
  showTransliteration = true,
  onClick,
  mastery,
  size = 'md'
}: LetterCardProps) {
  const styles = sizeClasses[size];
  const isInteractive = !!onClick;

  return (
    <div
      className={`
        bg-[--color-surface-raised] rounded-2xl border border-[--color-border] 
        ${styles.card} flex flex-col items-center justify-center gap-2 
        transition-all duration-300 group relative overflow-hidden
        ${isInteractive
          ? 'cursor-pointer hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95'
          : ''
        }
      `}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => e.key === 'Enter' && onClick?.() : undefined}
    >
      {/* Subtle gradient overlay on hover */}
      {isInteractive && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
      )}

      {mastery !== undefined && (
        <div className="absolute top-2 right-2">
          <Badge level={mastery} />
        </div>
      )}

      <span className={`${styles.devanagari} font-normal text-[--color-text-primary] leading-none devanagari group-hover:text-amber-100 transition-colors duration-300`}>
        {letter.devanagari}
      </span>

      {showTransliteration && (
        <span className={`${styles.transliteration} text-amber-400/80 font-medium tracking-wide`}>
          {letter.transliteration}
        </span>
      )}

      {size !== 'sm' && letter.pronunciationGuide && (
        <span className="text-xs text-[--color-text-muted] text-center leading-relaxed">
          {letter.pronunciationGuide}
        </span>
      )}
    </div>
  );
}
