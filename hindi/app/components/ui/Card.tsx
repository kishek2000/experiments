import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'glass';
}

export function Card({ title, children, className = '', onClick, variant = 'default' }: CardProps) {
  const variantClasses = {
    default: 'bg-[--color-surface] border border-[--color-border]',
    elevated: 'bg-[--color-surface-raised] border border-[--color-border-light] shadow-xl shadow-black/20',
    glass: 'glass border border-[--color-border]'
  };

  const baseClasses = `rounded-2xl overflow-hidden transition-all duration-300`;
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 active:scale-[0.98]' 
    : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {title && (
        <div className="px-5 py-4 border-b border-[--color-border]">
          <h3 className="font-semibold text-[--color-text-primary]">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
