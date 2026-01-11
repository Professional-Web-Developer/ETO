"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import fetcher from '../../../lib/fetcher';
import Button from '../../../components/ui/button';
import Modal from '../../../components/ui/modal';
import CashEntryForm from '../../../components/money/CashEntryForm';
import TransactionTable from '../../../components/money/TransactionTable';
import ObligationCard from '../../../components/money/ObligationCard';

export default function Page() {
  const [open, setOpen] = useState(false);
  const { data: report } = useSWR('/api/money/reports?range=day', fetcher);
  const { data: entries, mutate } = useSWR('/api/money/cashflow', fetcher);
  const { data: obligations } = useSWR('/api/money/obligations', fetcher);

  const totals = report?.totals || { in: 0, out: 0 };
  const net = (totals.in || 0) - (totals.out || 0);

  return (
    <div className="p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Agent Dashboard</h1>
        <div>
          <Button onClick={() => setOpen(true)}>Quick Add</Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm shadow-sm">
          <div className="text-sm text-neutral-300">Today IN</div>
          <div className="text-2xl font-semibold">₹{totals.in?.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm shadow-sm">
          <div className="text-sm text-neutral-300">Today OUT</div>
          <div className="text-2xl font-semibold">₹{totals.out?.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm shadow-sm">
          <div className="text-sm text-neutral-300">Net</div>
          <div className="text-2xl font-semibold">₹{net.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
          </div>
          <TransactionTable entries={entries?.slice(0, 10)} loading={!entries} error={null} />
        </div>

        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Obligations</h2>
          <div className="space-y-3">
            {(!obligations || obligations.length === 0) && <div>No obligations</div>}
            {obligations && obligations.slice(0, 3).map((o: any) => <ObligationCard key={o.id} obligation={o} />)}
          </div>
        </div>
      </div>

      <Modal open={open}>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Add Transaction</h3>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
          <CashEntryForm
            onSuccess={() => {
              setOpen(false);
              mutate && mutate();
            }}
            mutateCashflow={mutate}
          />
        </div>
      </Modal>
    </div>
  );
}
