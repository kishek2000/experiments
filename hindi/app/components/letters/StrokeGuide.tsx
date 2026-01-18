import type { StrokeInstruction } from '~/lib/curriculum/types';

interface StrokeGuideProps {
  strokeOrder: StrokeInstruction[];
  className?: string;
}

export function StrokeGuide({ strokeOrder, className = '' }: StrokeGuideProps) {
  if (strokeOrder.length === 0) {
    return null;
  }

  return (
    <div className={`bg-[--color-surface-raised] rounded-xl border border-[--color-border] p-5 ${className}`}>
      <h4 className="font-medium text-[--color-text-primary] mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        How to Write
      </h4>
      <ol className="space-y-3">
        {strokeOrder.map((stroke) => (
          <li key={stroke.step} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg flex items-center justify-center text-sm font-medium">
              {stroke.step}
            </span>
            <span className="text-[--color-text-secondary] text-sm pt-0.5 leading-relaxed">{stroke.description}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
