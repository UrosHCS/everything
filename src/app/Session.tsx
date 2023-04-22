'use client';

import { Header } from '../components/Header';
import { FirebaseSessionProvider } from '@lib/firebase/firebase-context';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Session({ children }: Props) {
  return (
    <FirebaseSessionProvider>
      <Header />
      <main className="flex flex-col items-center justify-between p-4">{children}</main>
    </FirebaseSessionProvider>
  );
}
