'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  children: string;
};

export function NavItem({ href, children }: Props) {
  const pathname = usePathname();
  const activeClass = pathname === href ? 'bg-purple-500' : '';

  return (
    <Link href={href} className={`inline-block w-full rounded p-4 text-xl ${activeClass}`}>
      {children}
    </Link>
  );
}
