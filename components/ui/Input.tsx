import React from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean };

export default function Input({ error, className, ...props }: Props) {
  return (
    <input
      aria-invalid={error ? 'true' : undefined}
      className={clsx(
        'w-full px-3 py-2 rounded-md bg-white/6 border placeholder:text-neutral-400 transition-colors',
        error ? 'border-red-400 focus-visible:ring-red-300' : 'border-white/6 focus-visible:ring-indigo-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}
