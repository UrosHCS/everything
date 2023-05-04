'use client';

import ProfileImage from './ProfileImage';
import { logout } from '@lib/firebase';
import useDropdown from '@lib/hooks/useDropdown';
import { User } from 'firebase/auth';
import Link from 'next/link';

type Props = {
  user: User;
};

export default function ProfileButtonDropdown({ user }: Props) {
  const [ref, isOpen, setIsOpen] = useDropdown();

  return (
    <div onClick={() => setIsOpen(!isOpen)} ref={ref} className="relative">
      <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-300">
        <ProfileImage user={user} />
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-3 flex flex-col gap-2 rounded bg-purple-800 p-1 shadow">
          <li>
            <Link href="/profile" className="btn-ghost btn">
              Profile
            </Link>
          </li>
          <li>
            <button className="btn-ghost btn" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
