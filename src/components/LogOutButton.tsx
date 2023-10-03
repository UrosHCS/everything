import { Button } from './ui/button';
import { logout } from '@lib/firebase';

export function LogOutButton() {
  return <Button onClick={logout}>Log out</Button>;
}
