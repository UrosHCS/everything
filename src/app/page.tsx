import { repos } from '@backend/repositories/repos';
import { Card } from '@components/ui/card';
import { Bot } from '@lib/firebase/models';
import Image from 'next/image';

async function Bots() {
  const bots = await repos.bots.findAll();

  return (
    <ul>
      {bots.map(bot => (
        <GiftedOne key={bot.id} bot={bot} />
      ))}
    </ul>
  );
}

type Props = {
  bot: Bot;
};

function GiftedOne({ bot }: Props) {
  return (
    <li className="p-2">
      <Card className="relative inline-block">
        <a href={`/chat/${bot.slug}`}>
          <Image src={bot.image} width={400} height={400} alt={bot.name} priority={true} />
          <div className="absolute inset-0 flex flex-col">
            <div className="flex flex-grow items-center p-2 text-center leading-relaxed opacity-30">
              {bot.description}
            </div>
            <div className="bg-black p-2 text-xl font-semibold text-red-200 opacity-50">{`-> ${bot.name}`}</div>
          </div>
        </a>
      </Card>
    </li>
  );
}

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center overflow-y-auto">
      <h1 className="py-4 text-center text-2xl font-semibold">Chat with a gifted one</h1>
      <Bots />
    </section>
  );
}
