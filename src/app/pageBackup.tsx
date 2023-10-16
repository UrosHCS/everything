import { Card } from '@components/ui/card';
import Image from 'next/image';

function GiftedOne({ name, src }: { name: string; src: string }) {
  return (
    <li className="p-2">
      <Card className="relative inline-block">
        <Image src={src} width={400} height={400} alt={name} priority={true} />
        <span className="absolute bottom-0 left-0 pb-2 pl-2 text-xl font-semibold">{name}</span>
      </Card>
    </li>
  );
}

export default function Home() {
  return (
    <>
      <section className="flex w-full flex-col items-center">
        <h1 className="py-4 text-3xl font-semibold">Chat with a gifted one</h1>
        <div className="flex w-full flex-col items-center">
          <ul className="overflow-y-auto">
            <div>Content</div>
            <GiftedOne name="Fortune teller" src="/fortune_teller_400.png" />
            <GiftedOne name="Prophet" src="/prophet_400.png" />
            <GiftedOne name="Astrologyst" src="/old_woman_astrologyst_400.png" />
          </ul>
        </div>
      </section>
    </>
  );
}
