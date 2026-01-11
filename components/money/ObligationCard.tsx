import React from 'react';
import Card from '../ui/Card';
import type { Obligation } from '../../types/money';

export default function ObligationCard({ obligation }: { obligation?: Obligation }) {
  const o = obligation || { id: -1, counterparty: 'Acme Corp', amount: '0.00', dueDate: new Date().toISOString(), status: 'PENDING' };
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-neutral-300">{o.counterparty}</div>
          <div className="font-semibold">₹{o.amount}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-300">Due</div>
          <div className="font-semibold">{new Date(o.dueDate).toLocaleDateString()}</div>
          <div className="mt-1 text-sm">{o.status}</div>
        </div>
      </div>
    </Card>
  );
}
