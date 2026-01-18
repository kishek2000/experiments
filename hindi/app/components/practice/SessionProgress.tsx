import { ProgressBar } from '../ui/ProgressBar';

interface SessionProgressProps {
  current: number;
  total: number;
  title?: string;
}

export function SessionProgress({ current, total, title = 'Progress' }: SessionProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{title}</span>
        <span>{current} / {total}</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
