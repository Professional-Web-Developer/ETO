import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { KeyedMutator } from 'swr';
import type { Obligation } from '../../types/money';

type Props = { onSuccess?: () => void; mutateObligations?: KeyedMutator<Obligation[]> };

export default function ObligationForm({ onSuccess, mutateObligations }: Props) {
  const [counterparty, setCounterparty] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    const amt = Number(amount);
    if (!counterparty) {
      setFieldErrors((s) => ({ ...s, counterparty: 'Please enter a name' }));
      return;
    }
    if (!amount || Number.isNaN(amt) || amt <= 0) {
      setFieldErrors((s) => ({ ...s, amount: 'Enter a positive amount' }));
      return;
    }

    setLoading(true);

    const temp: Obligation = { id: -(Date.now()), counterparty, amount: amt.toFixed(2), dueDate: dueDate || new Date().toISOString(), status: 'PENDING' } as any;

    let previous: Obligation[] | null = null;
    if (mutateObligations) {
      try {
        previous = await (await fetch('/api/money/obligations')).json();
      } catch (e) {
        previous = null;
      }
      try {
        await mutateObligations([temp, ...(previous || [])], false);
      } catch (_) {}
    }

    try {
      const res = await fetch('/api/money/obligations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counterparty, amount: amt.toFixed(2), dueDate }) });
      const body = await res.json();
      if (!res.ok) {
        if (body?.error === 'validation' && body?.details?.fieldErrors) {
          const errs = body.details.fieldErrors as Record<string, string[]>;
          const mapped: Record<string, string> = {};
          for (const k of Object.keys(errs)) mapped[k] = errs[k]?.[0] || 'Invalid';
          setFieldErrors(mapped);
          throw new Error('validation');
        }
        throw new Error(body.error || 'Failed');
      }

      setCounterparty('');
      setAmount('');
      setDueDate('');

      if (mutateObligations) await mutateObligations();
      onSuccess && onSuccess();
    } catch (err: any) {
      if (mutateObligations && previous) await mutateObligations(previous, false);
      if (err.message !== 'validation') setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="glass p-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Input value={counterparty} onChange={(e) => { setCounterparty(e.target.value); setFieldErrors((s) => ({ ...s, counterparty: null })); }} placeholder="Counterparty" />
          {fieldErrors.counterparty && <div className="text-xs text-red-400 mt-1">{fieldErrors.counterparty}</div>}
        </div>
        <div>
          <Input value={amount} onChange={(e) => { setAmount(e.target.value); setFieldErrors((s) => ({ ...s, amount: null })); }} placeholder="Amount" />
          {fieldErrors.amount && <div className="text-xs text-red-400 mt-1">{fieldErrors.amount}</div>}
        </div>
        <div>
          <Input type="date" value={dueDate} onChange={(e) => { setDueDate(e.target.value); setFieldErrors((s) => ({ ...s, dueDate: null })); }} placeholder="Due Date" />
          {fieldErrors.dueDate && <div className="text-xs text-red-400 mt-1">{fieldErrors.dueDate}</div>}
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Obligation'}</Button>
      </div>
      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
    </form>
  );
}
