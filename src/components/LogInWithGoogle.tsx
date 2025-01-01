import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LogInWithGoogleButton() {
  return (
    <Button onClick={() => signIn('google')}>
      <span className="flex items-center justify-center gap-2">
        <Image width={24} height={24} src="/google.svg" alt="Google" />
        <span>Log in with Google</span>
      </span>
    </Button>
  );
}
