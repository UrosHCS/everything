import { ChatConversation } from '../../ChatConversation';
import { getBotBySlug, getConversationPreviewsForBot } from '../../server';
import { repos } from '@backend/repositories/repos';
import { Bot, Conversation } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string; conversationId: string };
};

export default async function ChatBotConversation({ params }: Props) {
  const bot = await getBotBySlug(params.slug);
  const conversation = await getConversationById(params.conversationId);

  if (!bot || !conversation) {
    redirect('/');
  }

  const conversationPreviews = await getConversationPreviewsForBot(bot);

  return <ChatConversation bot={bot} initialConversation={conversation} conversationPreviews={conversationPreviews} />;
}

async function getConversationById(id: string): Promise<DocWithId<Conversation> | undefined> {
  if (!id) return;

  return repos.conversations.findById(id);
}
