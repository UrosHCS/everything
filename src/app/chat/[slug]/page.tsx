import { ChatConversation } from './ChatConversation';
import { getBotBySlug, getConversationPreviewsForBot } from './server';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ChatBot({ params }: Props) {
  const { slug } = await params;

  const bot = await getBotBySlug(slug);

  if (!bot) redirect('/');

  const conversationPreviews = await getConversationPreviewsForBot(bot);

  return <ChatConversation bot={bot} conversationPreviews={conversationPreviews} />;
}
