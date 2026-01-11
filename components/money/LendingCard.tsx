import React from 'react';
import Card from '../ui/Card';

export default function LendingCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-300">Person</div>
          <div className="font-semibold">John Doe</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-300">Amount</div>
          <div className="font-semibold">$200</div>
        </div>
      </div>
    </Card>
  );
}
