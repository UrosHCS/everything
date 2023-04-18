import Image from 'next/image';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-semibold py-4">Are you ready?</h1>
      <Image src="/beginning.webp" alt="Next.js logo" width={384} height={768} />
    </>
  );
}
