import React, { useEffect, useRef } from 'react';

export default function Modal({ children, open, onClose }: { children: React.ReactNode; open: boolean; onClose?: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    const el = containerRef.current;
    el?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={containerRef} tabIndex={-1} className="relative z-50 p-6 glass w-full max-w-lg" aria-label="Modal">
        {children}
      </div>
    </div>
  );
}
