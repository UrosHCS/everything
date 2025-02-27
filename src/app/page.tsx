import { db } from '@backend/drizzle/db';
import { Bot } from '@backend/drizzle/schema';
import { Card } from '@components/ui/card';
import Image from 'next/image';

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center overflow-y-auto">
      <h1 className="py-4 text-center text-2xl font-semibold">Chat with a gifted one</h1>
      <Bots />
    </section>
  );
}

async function Bots() {
  const bots = await db.query.bots.findMany();

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
            <div className="flex flex-grow items-center p-2 text-center leading-relaxed text-slate-50 opacity-30">
              {bot.description}
            </div>
            <div className="bg-slate-50 p-2 text-xl font-semibold text-slate-800 opacity-50 dark:bg-black dark:text-red-200">{`-> ${bot.name}`}</div>
          </div>
        </a>
      </Card>
    </li>
  );
}
