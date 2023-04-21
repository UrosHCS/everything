'use client';

import LoginButton from './LoginButton';
import { SessionProvider } from 'next-auth/react';

export default function LoginOrProfile() {
  return (
    <SessionProvider>
      <LoginButton />
    </SessionProvider>
  );
}
