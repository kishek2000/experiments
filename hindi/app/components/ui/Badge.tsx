import type { MasteryLevel } from '~/lib/curriculum/types';

interface BadgeProps {
  level: MasteryLevel;
  className?: string;
}

const levelConfig: Record<MasteryLevel, { label: string; classes: string }> = {
  new: {
    label: 'New',
    classes: 'bg-[--color-surface-elevated] text-[--color-text-muted] border-[--color-border]'
  },
  learning: {
    label: 'Learning',
    classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  },
  familiar: {
    label: 'Familiar',
    classes: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
  },
  mastered: {
    label: 'Mastered',
    classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  }
};

export function Badge({ level, className = '' }: BadgeProps) {
  const config = levelConfig[level];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${config.classes} ${className}`}
    >
      {config.label}
    </span>
  );
}
