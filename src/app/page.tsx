import Image from 'next/image';

export default function Home() {
  return (
    <>
      <h1 className="py-4 text-3xl font-semibold">Are you ready?</h1>
      <Image src="/beginning.webp" alt="Next.js logo" width={384} height={768} />
    </>
  );
}
