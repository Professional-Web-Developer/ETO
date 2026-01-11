import './globals.css';
import React from 'react';

export const metadata = {
  title: 'ETO - Eleven to One',
  description: 'Money management and service distribution platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white">
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
