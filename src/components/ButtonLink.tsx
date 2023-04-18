import Link from 'next/link';

type Props = {
  href: string;
  children: string;
};

export function ButtonLink({ href, children }: Props) {
  return (
    <Link href={href} className="btn btn-ghost normal-case text-xl">
      {children}
    </Link>
  );
}
