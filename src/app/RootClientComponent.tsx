'use client';

import { Header } from '../components/Header';
import { FirebaseSessionProvider } from '@lib/firebase/context';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

/**
 * First client component. FirebaseSessionProvider uses useState.
 */
export default function RootClientComponent({ children }: Props) {
  return (
    <FirebaseSessionProvider>
      <Header />
      <main className="flex h-full flex-col items-center overflow-y-hidden">{children}</main>
    </FirebaseSessionProvider>
  );
}
