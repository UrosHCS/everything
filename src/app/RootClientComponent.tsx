'use client';

import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

/**
 * First client component. FirebaseSessionProvider uses useState.
 */
export default function RootClientComponent({ children }: Props) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex h-full flex-col items-center overflow-y-hidden">{children}</main>
    </SessionProvider>
  );
}
