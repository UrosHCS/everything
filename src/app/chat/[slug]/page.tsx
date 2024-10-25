import { ChatConversation } from './ChatConversation';
import { getBotBySlug, getConversationPreviewsForBot } from './server';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ChatBot({ params }: Props) {
  const { slug } = await params;

  const timings = {
    getBotBySlug: 0,
    getConversationPreviewsForBot: 0,
  };

  const start = performance.now();
  const bot = await getBotBySlug(slug);
  timings.getBotBySlug = performance.now() - start;

  if (!bot) redirect('/');

  const start2 = performance.now();
  const conversationPreviews = await getConversationPreviewsForBot(bot);
  timings.getConversationPreviewsForBot = performance.now() - start2;

  return <ChatConversation bot={bot} conversationPreviews={conversationPreviews} timings={timings} />;
}
