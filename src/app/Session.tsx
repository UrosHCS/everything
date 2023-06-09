'use client';

import { Header } from '../components/Header';
import { FirebaseSessionProvider } from '@lib/firebase/context';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Session({ children }: Props) {
  return (
    <FirebaseSessionProvider>
      <Header />
      <main className="flex h-full flex-col items-center overflow-y-hidden p-4">{children}</main>
    </FirebaseSessionProvider>
  );
}
