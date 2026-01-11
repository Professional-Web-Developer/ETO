import React from 'react';
import LendingCard from '../../../../components/money/LendingCard';

export default function Page() {
  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Lending</h1>
      <div className="space-y-4">
        <LendingCard />
        <LendingCard />
      </div>
    </div>
  );
}
