import type { Letter } from '~/lib/curriculum/types';

interface RecognitionCardProps {
  letter: Letter;
  showTransliteration?: boolean;
}

export function RecognitionCard({ letter, showTransliteration = false }: RecognitionCardProps) {
  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <span className="text-7xl text-gray-900 leading-none mb-4">
        {letter.devanagari}
      </span>
      {showTransliteration && (
        <span className="text-lg text-gray-600">{letter.transliteration}</span>
      )}
    </div>
  );
}
