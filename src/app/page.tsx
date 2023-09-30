import { Card } from '@components/ui/card';
import { ScrollArea } from '@components/ui/scroll-area';
import Image from 'next/image';

function GiftedOne({ name, src }: { name: string; src: string }) {
  return (
    <li className="p-2">
      <Card className="relative inline-block">
        <Image src={src} width={400} height={400} alt={name} priority={true} />
        <a
          href={`/chat/1`}
          className="absolute bottom-0 left-0 w-full bg-black p-2 text-xl font-semibold text-red-200 opacity-50"
        >
          {`-> ${name}`}
        </a>
      </Card>
    </li>
  );
}

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center overflow-y-auto">
      <h1 className="py-4 text-center text-2xl font-semibold">Chat with a gifted one</h1>
      <ul className="">
        <GiftedOne name="Fortune teller" src="/fortune_teller_400.png" />
        <GiftedOne name="Prophet" src="/prophet_400.png" />
        <GiftedOne name="Astrologyst" src="/old_woman_astrologyst_400.png" />
      </ul>
    </section>
  );
}
