import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`px-4 py-5 max-w-4xl mx-auto ${className}`}>
      {children}
    </div>
  );
}
