'use client';

import ProfileImage from '../../components/profile/ProfileImage';
import { useSession } from '@lib/firebase/firebase-context';

export default function Profile() {
  const { user, status } = useSession();

  if (status === 'loading') return <p>spinner</p>;

  if (!user) {
    return <h2>Please log in to view your profile</h2>;
  }

  return (
    <>
      <h2 className="py-4 text-3xl font-semibold">{user.displayName}</h2>
      <div className="flex items-center gap-2">
        <ProfileImage user={user} />
        <p>{user.email}</p>
      </div>
    </>
  );
}
