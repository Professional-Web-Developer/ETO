import React from 'react';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
};

const paddingMap = { sm: 'p-2', md: 'p-4', lg: 'p-6' } as const;

export default function Card({ children, className = '', variant = 'default', padding = 'md' }: Props) {
  return (
    <div className={clsx('glass rounded-md', paddingMap[padding], variant === 'elevated' && 'shadow-lg', className)}>
      {children}
    </div>
  );
}
