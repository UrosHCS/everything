import { User } from 'firebase/auth';
import Image from 'next/image';

type Props = {
  user: User;
};

export default function ProfileImage({ user }: Props) {
  if (user.photoURL) {
    return (
      <Image
        className="rounded-full"
        width={32}
        height={32}
        src={user.photoURL}
        alt={user.displayName ?? 'Profile'}
      ></Image>
    );
  }

  return <span>{user.displayName?.slice(0, 1) ?? 'P'}</span>;
}
