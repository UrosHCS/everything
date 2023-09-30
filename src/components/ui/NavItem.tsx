'use client';

import Link from 'next/link';

type Props = {
  href: string;
  children: string;
};

export function NavItem({ href, children }: Props) {
  return <Link href={href}>{children}</Link>;
}
