import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${hover ? 'cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
