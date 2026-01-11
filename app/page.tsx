import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">ETO — Home</h1>
      <p className="mb-6">Choose a workspace:</p>
      <ul className="space-y-3">
        <li>
          <Link href="/agent/dashboard" className="text-blue-400 underline">Agent Dashboard</Link>
        </li>
        <li>
          <Link href="/admin/dashboard" className="text-blue-400 underline">Admin Dashboard</Link>
        </li>
      </ul>
    </main>
  );
}
