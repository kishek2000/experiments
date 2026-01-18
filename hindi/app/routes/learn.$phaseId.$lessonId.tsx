import { Link, useParams } from 'react-router';
import { phases, getLettersForLesson } from '~/lib/curriculum';
import { LetterCard, StrokeGuide } from '~/components/letters';
import { Button, Card } from '~/components/ui';

export function meta() {
  return [
    { title: 'Lesson - Sikho' }
  ];
}

export default function LessonDetail() {
  const { phaseId, lessonId } = useParams();
  const phase = phases.find(p => p.id === Number(phaseId));
  const lesson = phase?.lessons.find(l => l.id === Number(lessonId));
  const letters = getLettersForLesson(Number(phaseId), Number(lessonId));

  if (!phase || !lesson) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
        <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
        <Link to="/learn" className="text-indigo-600 hover:text-indigo-700">
          Back to Phases
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-indigo-600 mb-1">{phase.title}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-gray-600">{lesson.description}</p>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {letters.map((letter) => (
          <Link key={letter.id} to={`/reference/${letter.id}`}>
            <LetterCard letter={letter} size="md" />
          </Link>
        ))}
      </div>

      {/* Stroke Guides */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Writing Instructions</h2>
      <div className="space-y-4 mb-8">
        {letters.map((letter) => (
          <Card key={letter.id}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0 text-center">
                <span className="text-5xl">{letter.devanagari}</span>
                <p className="text-sm text-gray-500 mt-1">{letter.transliteration}</p>
              </div>
              <div className="flex-1">
                <StrokeGuide strokeOrder={letter.strokeOrder} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Practice Button */}
      <div className="flex justify-center gap-4">
        <Link to="/practice">
          <Button size="lg">Practice These Letters</Button>
        </Link>
      </div>
    </div>
  );
}
