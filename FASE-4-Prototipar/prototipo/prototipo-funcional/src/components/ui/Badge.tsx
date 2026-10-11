import type { ReactNode } from 'react';

type Color = 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'teal';

interface BadgeProps {
  color?: Color;
  children: ReactNode;
  size?: 'sm' | 'md';
}

const colorClasses: Record<Color, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-600',
  teal: 'bg-teal-100 text-teal-800',
};

export default function Badge({ color = 'gray', children, size = 'md' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${colorClasses[color]} ${sizeClass}`}>
      {children}
    </span>
  );
}
