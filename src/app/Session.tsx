'use client';

import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Session({ children }: Props) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex flex-col items-center justify-between p-4">{children}</main>
    </SessionProvider>
  );
}
