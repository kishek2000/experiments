import { useState } from 'react';
import { useNavigate } from 'react-router';
import { allLetters, vowels, consonants, matras, conjuncts } from '~/lib/curriculum';
import { LetterGrid } from '~/components/letters';
import type { Letter } from '~/lib/curriculum/types';

type FilterType = 'all' | 'vowels' | 'consonants' | 'matras' | 'conjuncts';

const filterOptions: { value: FilterType; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'amber' },
  { value: 'vowels', label: 'Vowels', color: 'rose' },
  { value: 'consonants', label: 'Consonants', color: 'sky' },
  { value: 'matras', label: 'Matras', color: 'emerald' },
  { value: 'conjuncts', label: 'Conjuncts', color: 'violet' }
];

const filterMap: Record<FilterType, Letter[]> = {
  all: allLetters,
  vowels,
  consonants,
  matras,
  conjuncts
};

export function meta() {
  return [
    { title: 'Reference - Sikho' },
    { name: 'description', content: 'Complete Devanagari alphabet reference' }
  ];
}

export default function ReferenceIndex() {
  const [filter, setFilter] = useState<FilterType>('all');
  const navigate = useNavigate();
  const letters = filterMap[filter];

  const handleLetterClick = (letter: Letter) => {
    navigate(`/reference/${letter.id}`);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">Alphabet Reference</h1>
      <p className="text-[--color-text-secondary] mb-8">
        Browse all Devanagari letters. Tap any letter for details.
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              filter === option.value
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[--color-base] shadow-lg shadow-amber-500/20'
                : 'bg-[--color-surface] text-[--color-text-secondary] border border-[--color-border] hover:bg-[--color-surface-raised] hover:text-[--color-text-primary]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Letter count */}
      <p className="text-sm text-[--color-text-muted] mb-6">
        Showing <span className="text-amber-400 font-medium">{letters.length}</span> letters
      </p>

      {/* Letter Grid */}
      <LetterGrid
        letters={letters}
        onLetterClick={handleLetterClick}
        showTransliteration
        size="sm"
      />

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
