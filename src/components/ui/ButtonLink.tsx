import Link from 'next/link';

type Props = {
  href: string;
  children: string;
};

export function ButtonLink({ href, children }: Props) {
  return (
    <Link href={href} className="btn-ghost btn text-xl normal-case">
      {children}
    </Link>
  );
}
