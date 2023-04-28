'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  href: string;
  children: string;
};

export function NavItem({ href, children }: Props) {
  const pathname = usePathname();
  const activeClass = pathname === href ? 'btn-active' : '';

  return (
    <Link href={href} className={`btn-ghost btn text-xl normal-case ${activeClass}`}>
      {children}
    </Link>
  );
}
