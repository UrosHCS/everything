import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

export function LogOutButton() {
  return <Button onClick={() => signOut()}>Log out</Button>;
}
