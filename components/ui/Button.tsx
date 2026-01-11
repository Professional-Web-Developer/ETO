import React from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const sizeMap: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-3',
};

export default function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  const base = 'rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const variantCls =
    variant === 'primary'
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
      : variant === 'secondary'
      ? 'glass hover:brightness-105 text-white'
      : variant === 'ghost'
      ? 'bg-transparent hover:bg-white/4 text-white'
      : 'bg-transparent border border-white/8 text-white';

  return (
    <button className={clsx(base, sizeMap[size], variantCls, className)} {...props} />
  );
}
