'use client';

import { NavItem } from '../NavItem';
import ProfileButton from './ProfileButton';
import { useSession } from '@lib/firebase/firebase-context';

export default function LoginOrProfile() {
  const { user, status } = useSession();

  if (status === 'loading') return <p>spinner</p>;

  if (!user) {
    return <NavItem href="/login">Login</NavItem>;
  }

  return <ProfileButton user={user} />;
}
