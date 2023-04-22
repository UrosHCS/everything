import ProfileImage from './ProfileImage';
import { logout } from '@lib/firebase';
import { User } from 'firebase/auth';
import Link from 'next/link';

type Props = {
  user: User;
};

export default function ProfileButton({ user }: Props) {
  return (
    <div className="drop relative">
      <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-400">
        <ProfileImage user={user} />
      </button>
      <ul className="drop-items invisible absolute right-0 mt-3 flex flex-col gap-2 rounded bg-slate-800 p-1 shadow">
        <Link href="/profile" className="btn-ghost btn">
          Profile
        </Link>
        <button className="btn-ghost btn" onClick={logout}>
          Logout
        </button>
      </ul>
    </div>
  );
}
