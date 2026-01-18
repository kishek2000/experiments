import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`relative z-10 max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8 ${className}`}>
      {children}
    </main>
  );
}
