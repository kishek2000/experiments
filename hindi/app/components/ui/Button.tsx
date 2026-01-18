import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-[--color-base] font-semibold hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30',
  secondary: 'bg-[--color-surface-raised] text-[--color-text-primary] border border-[--color-border] hover:bg-[--color-surface-elevated] hover:border-[--color-border-light]',
  ghost: 'bg-transparent text-[--color-text-secondary] hover:bg-[--color-surface-raised] hover:text-[--color-text-primary]',
  danger: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:from-rose-400 hover:to-rose-500 shadow-lg shadow-rose-500/20'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl'
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-base] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
