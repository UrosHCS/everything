import { ChatConversation } from './ChatConversation';
import { getBotBySlug, getConversationPreviewsForBot } from './server';
import { redirect } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export default async function ChatBot({ params }: Props) {
  const bot = await getBotBySlug(params.slug);

  if (!bot) redirect('/');

  const conversationPreviews = await getConversationPreviewsForBot(bot);

  return <ChatConversation bot={bot} conversationPreviews={conversationPreviews} />;
}
