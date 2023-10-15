import { ChatConversation } from '../../Conversation';
import { repos } from '@backend/repositories/repos';
import { Bot, Conversation } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string; conversationId: string };
};

export default async function Chat({ params }: Props) {
  const bot = await getBotBySlug(params.slug);
  const conversation = await getConversationById(params.conversationId);

  if (!bot || !conversation) redirect('/');

  return <ChatConversation bot={bot} initialConversation={conversation} />;
}

async function getBotBySlug(slug: string): Promise<DocWithId<Bot> | undefined> {
  if (!slug) return;

  return repos.bots.findOneBy('slug', slug);
}

async function getConversationById(id: string): Promise<DocWithId<Conversation> | undefined> {
  if (!id) return;

  return repos.conversations.findById(id);
}
