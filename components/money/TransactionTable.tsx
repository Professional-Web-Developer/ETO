import React from 'react';
import Table from '../ui/Table';
import type { CashEntry } from '../../types/money';

export default function TransactionTable({ entries, loading, error }: { entries?: CashEntry[]; loading?: boolean; error?: string | null }) {
  const rows = entries || [];

  return (
    <div>
      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
      <Table>
        <thead>
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Category</th>
            <th className="p-2">Note</th>
            <th className="p-2">At</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="p-2" colSpan={5}>Loading...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td className="p-2" colSpan={5}>No entries</td>
            </tr>
          ) : (
            rows.map((t) => (
              <tr key={t.id} className="border-t border-white/6">
                <td className="p-2">{t.type}</td>
                <td className="p-2">{t.amount}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2">{t.note}</td>
                <td className="p-2">{new Date(t.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
