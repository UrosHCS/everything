import { ChatConversation } from './Conversation';
import { repos } from '@backend/repositories/repos';
import { Bot } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export default async function Chat({ params }: Props) {
  const bot = await getBotBySlug(params.slug);

  if (!bot) redirect('/');

  return <ChatConversation bot={bot} />;
}

async function getBotBySlug(slug: string): Promise<DocWithId<Bot> | undefined> {
  if (!slug) return;

  return repos.bots.findOneBy('slug', slug);
}
