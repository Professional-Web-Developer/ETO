"use client";
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import CashEntryForm from '../../../../components/money/CashEntryForm';
import TransactionTable from '../../../../components/money/TransactionTable';
import type { CashEntry } from '../../../../types/money';

const fetcher = (url: string) => fetch(url).then(async (r) => {
  if (!r.ok) throw new Error((await r.json()).error || r.statusText);
  return r.json();
});

export default function Page() {
  const { data, error, mutate } = useSWR<CashEntry[]>('/api/money/cashflow', fetcher);
  const loading = !data && !error;

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Cashflow</h1>
      <div className="space-y-4">
        <CashEntryForm mutateCashflow={mutate} />
        <TransactionTable entries={data} loading={loading} error={error?.message ?? null} />
      </div>
    </div>
  );
}
