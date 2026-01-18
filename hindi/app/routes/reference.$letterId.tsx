import { useParams, Link } from 'react-router';
import { getLetterById } from '~/lib/curriculum';
import { LetterCard, StrokeGuide, AudioButton } from '~/components/letters';
import { Card } from '~/components/ui';

export function meta() {
  return [
    { title: 'Letter Detail - Sikho' }
  ];
}

export default function LetterDetail() {
  const { letterId } = useParams();
  const letter = getLetterById(letterId || '');

  if (!letter) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Letter Not Found</h1>
        <p className="text-gray-600 mb-4">The letter you're looking for doesn't exist.</p>
        <Link to="/reference" className="text-indigo-600 hover:text-indigo-700">
          Back to Reference
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Large Letter Display */}
      <div className="flex justify-center mb-6">
        <LetterCard letter={letter} size="lg" showTransliteration />
      </div>

      {/* Audio Button (placeholder) */}
      <div className="flex justify-center mb-8">
        <AudioButton audioUrl={letter.audioUrl} />
      </div>

      {/* Details */}
      <div className="space-y-6">
        {/* Basic Info */}
        <Card title="Details">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Type</dt>
              <dd className="font-medium text-gray-900 capitalize">{letter.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Transliteration</dt>
              <dd className="font-medium text-gray-900">{letter.transliteration}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-gray-500">Pronunciation</dt>
              <dd className="font-medium text-gray-900">{letter.pronunciationGuide}</dd>
            </div>
            {letter.matraForm && (
              <div className="col-span-2">
                <dt className="text-sm text-gray-500">Matra Form (dependent vowel)</dt>
                <dd className="font-medium text-gray-900 text-2xl">{letter.matraForm}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Stroke Guide */}
        <Card title="How to Write">
          <StrokeGuide strokeOrder={letter.strokeOrder} />
        </Card>

        {/* Example Words */}
        <Card title="Example Words">
          <div className="space-y-3">
            {letter.exampleWords.map((word, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="text-2xl text-gray-900">{word.devanagari}</span>
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-gray-600">{word.transliteration}</span>
                </div>
                <span className="text-gray-500">{word.meaning}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Practice Button */}
      <div className="mt-8 flex justify-center">
        <Link to="/practice">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Practice This Letter
          </button>
        </Link>
      </div>
    </div>
  );
}
