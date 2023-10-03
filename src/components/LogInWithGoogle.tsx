import { Button } from './ui/button';
import { signInWithGoogle } from '@lib/firebase';
import Image from 'next/image';

export function LogInWithGoogleButton() {
  return (
    <Button onClick={signInWithGoogle}>
      <span className="flex items-center justify-center gap-2">
        <Image width={24} height={24} src="/google.svg" alt="Google" />
        <span>Log in with Google</span>
      </span>
    </Button>
  );
}
