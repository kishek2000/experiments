import { Link, useParams } from 'react-router';
import { phases, getLettersForLesson } from '~/lib/curriculum';
import { Card } from '~/components/ui';

export function meta() {
  return [
    { title: 'Phase - Sikho' }
  ];
}

export default function PhaseDetail() {
  const { phaseId } = useParams();
  const phase = phases.find(p => p.id === Number(phaseId));

  if (!phase) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Phase Not Found</h1>
        <p className="text-gray-600 mb-4">The phase you're looking for doesn't exist.</p>
        <Link to="/learn" className="text-indigo-600 hover:text-indigo-700">
          Back to Phases
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h1>
      <p className="text-gray-600 mb-6">{phase.description}</p>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h2>
      <div className="space-y-3">
        {phase.lessons.map((lesson, index) => {
          const letters = getLettersForLesson(phase.id, lesson.id);
          const letterPreview = letters.slice(0, 5).map(l => l.devanagari).join(' ');

          return (
            <Link key={lesson.id} to={`/learn/${phase.id}/${lesson.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-700">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                    <p className="text-lg text-gray-400 mt-1">{letterPreview}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
