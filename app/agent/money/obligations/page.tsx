import React from 'react';
import ObligationCard from '../../../../components/money/ObligationCard';
import ObligationForm from '../../../../components/money/ObligationForm';
import useSWR from 'swr';
import fetcher from '../../../../lib/fetcher';

export default function Page() {
  const { data, error, mutate } = useSWR('/api/money/obligations', fetcher);

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Obligations</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1">
          <ObligationForm mutateObligations={mutate} />
        </div>
        <div className="md:col-span-2">
          <div className="space-y-3">
            {error && <div className="text-sm text-red-400">Failed to load obligations</div>}
            {!data ? (
              <div>Loading...</div>
            ) : data.length === 0 ? (
              <div>No obligations</div>
            ) : (
              data.map((o: any) => <ObligationCard key={o.id} obligation={o} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
