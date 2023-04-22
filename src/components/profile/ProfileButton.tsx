import { Session } from 'next-auth';
import Image from 'next/image';

type Props = {
  user: Session['user'];
};

export default function ProfileButton({ user }: Props) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-400">
      {user?.image && (
        <Image className="rounded-full" width={32} height={32} src={user.image} alt={user?.name ?? 'Profile'}></Image>
      )}
    </button>
  );
}
