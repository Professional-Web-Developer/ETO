import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import type { KeyedMutator } from 'swr';
import type { CashEntry } from '../../types/money';

type Props = { onSuccess?: () => void; mutateCashflow?: KeyedMutator<CashEntry[]> };

export default function CashEntryForm({ onSuccess, mutateCashflow }: Props) {
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const amt = Number(amount);
    if (!amount || Number.isNaN(amt) || amt <= 0) {
      setFieldErrors((s) => ({ ...s, amount: 'Please enter a valid amount greater than 0' }));
      return;
    }

    setLoading(true);

    // optimistic update: insert temp entry
    const temp = {
      id: -(Date.now()),
      type,
      amount: amt.toFixed(2),
      category,
      note,
      timestamp: new Date().toISOString()
    };

    // perform optimistic update if mutate function provided
    let previous: CashEntry[] | null = null;
    if (mutateCashflow) {
      try {
        previous = await (await fetch('/api/money/cashflow')).json();
      } catch (e) {
        previous = null;
      }
      try {
        await mutateCashflow([temp, ...(previous || [])], false);
      } catch (_) {}
    }

    try {
      const res = await fetch('/api/money/cashflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: amt.toFixed(2), category, note })
      });

      const body = await res.json();
      if (!res.ok) {
        if (body?.error === 'validation' && body?.details?.fieldErrors) {
          const errs = body.details.fieldErrors as Record<string, string[]>;
          const mapped: Record<string, string> = {};
          for (const k of Object.keys(errs)) mapped[k] = errs[k]?.[0] || 'Invalid';
          setFieldErrors(mapped);
          throw new Error('validation');
        }
        throw new Error(body.error || 'Failed to create entry');
      }

      // success
      setAmount('');
      setNote('');
      setCategory('Salary');
      setType('IN');

      // revalidate the SWR cache if mutate function was passed
      if (mutateCashflow) await mutateCashflow();
      onSuccess && onSuccess();
    } catch (err: any) {
      // revert optimistic update if we have previous
      if (mutateCashflow && previous) await mutateCashflow(previous, false);
      if (err.message !== 'validation') setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="glass p-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Select value={type} onChange={(e) => { setType(e.target.value as any); setFieldErrors((s) => ({ ...s, type: null })); }}>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </Select>
          {fieldErrors.type && <div className="text-xs text-red-400 mt-1">{fieldErrors.type}</div>}
        </div>
        <div>
          <Input value={amount} onChange={(e) => { setAmount(e.target.value); setFieldErrors((s) => ({ ...s, amount: null })); }} placeholder="Amount" />
          {fieldErrors.amount && <div className="text-xs text-red-400 mt-1">{fieldErrors.amount}</div>}
        </div>
        <div>
          <Input value={category} onChange={(e) => { setCategory(e.target.value); setFieldErrors((s) => ({ ...s, category: null })); }} placeholder="Category" />
          {fieldErrors.category && <div className="text-xs text-red-400 mt-1">{fieldErrors.category}</div>}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Input value={note} onChange={(e) => { setNote(e.target.value); setFieldErrors((s) => ({ ...s, note: null })); }} placeholder="Note" />
          {fieldErrors.note && <div className="text-xs text-red-400 mt-1">{fieldErrors.note}</div>}
        </div>
        <div />
        <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add'}</Button>
      </div>
      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
    </form>
  );
}
