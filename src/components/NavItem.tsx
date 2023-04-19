import Link from 'next/link';

type Props = {
  href: string;
  children: string;
};

export function NavItem({ href, children }: Props) {
  return (
    <li>
      <Link href={href} className="btn-ghost btn w-full text-xl normal-case lg:w-auto">
        {children}
      </Link>
    </li>
  );
}
