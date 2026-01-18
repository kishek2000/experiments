interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  color?: 'amber' | 'emerald' | 'sky' | 'rose';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  amber: 'from-amber-500 to-amber-400',
  emerald: 'from-emerald-500 to-emerald-400',
  sky: 'from-sky-500 to-sky-400',
  rose: 'from-rose-500 to-rose-400'
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

export function ProgressBar({
  value,
  className = '',
  showLabel = false,
  color = 'amber',
  size = 'md'
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-[--color-text-muted]">Progress</span>
          <span className="font-medium text-[--color-text-primary]">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-[--color-surface-elevated] rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
