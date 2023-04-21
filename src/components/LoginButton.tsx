'use client';

import { signIn, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data } = useSession();

  return (
    <button onClick={() => signIn('google')} className="btn-ghost btn text-xl normal-case">
      {data ? `Hello, ${data.user!.name}` : 'Login'}
    </button>
  );
}
