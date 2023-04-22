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
    <li>
      <Link href={href} className={`btn-ghost btn w-full text-xl normal-case lg:w-auto ${activeClass}`}>
        {children}
      </Link>
    </li>
  );
}
