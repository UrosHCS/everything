'use client';

import ProfileButton from './ProfileButton';
import { signIn, useSession } from 'next-auth/react';

export default function LoginOrProfile() {
  const { data, status } = useSession();

  if (status === 'unauthenticated') {
    return (
      <button onClick={() => signIn('google')} className="btn-ghost btn text-xl normal-case">
        Login
      </button>
    );
  }

  return <ProfileButton user={data?.user} />;
}
