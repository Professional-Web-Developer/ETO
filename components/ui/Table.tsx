import React from 'react';

export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-auto bg-white/4 rounded-md p-3">
      <table className="w-full text-left">{children}</table>
    </div>
  );
}
