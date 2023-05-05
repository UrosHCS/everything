'use client';

import { NavItem } from '../NavItem';
import ProfileButtonDropdown from './ProfileButtonDropdown';
import { useSession } from '@lib/firebase/context';

export default function LoginOrProfile() {
  const { user, status } = useSession();

  if (status === 'loading') return <p>spinner</p>;

  if (!user) {
    return (
      <div>
        <NavItem href="/login">Login</NavItem>
      </div>
    );
  }

  return <ProfileButtonDropdown user={user} />;
}
