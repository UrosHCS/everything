import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfileImage() {
  const { data: session, status } = useSession();

  const user = session?.user;
  if (status === 'loading') {
    return null;
  }

  if (!user) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-user"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    );
  }

  if (user.image) {
    return <Image className="rounded-full" width={32} height={32} src={user.image} alt={user.name ?? 'Profile'} />;
  }

  return <span>{user.name?.slice(0, 1) ?? 'P'}</span>;
}
