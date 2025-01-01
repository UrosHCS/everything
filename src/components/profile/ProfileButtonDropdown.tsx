'use client';

import ProfileImage from './ProfileImage';
import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ProfileButtonDropdown() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full border-2" variant="outline" size="icon">
          <ProfileImage />
          <span className="sr-only">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <Link href="/login">
            <DropdownMenuItem className="cursor-pointer">Login</DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
