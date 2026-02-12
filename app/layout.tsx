import type React from 'react';
import { ReactNode } from 'react';
import { TokenAuthProvider } from '@/lib/contexts/TokenAuthContext';
import '@/styles/globals.css';

export const metadata = {
  title: 'Daily Puzzle Game',
  description: 'A daily engagement puzzle game to build your solving streak',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
        <TokenAuthProvider>
          {children}
        </TokenAuthProvider>
      </body>
    </html>
  );
}
