import { ChatConversation } from '../../ChatConversation';
import { getBotBySlug, getConversationPreviewsForBot } from '../../server';
import { getServerSideSession } from '@backend/auth/getServerSideSession';
import { db } from '@backend/drizzle/db';
import { Conversation } from '@backend/drizzle/schema';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string; conversationId: string }>;
};

export default async function ChatBotConversation({ params }: Props) {
  const [{ slug, conversationId }, session] = await Promise.all([params, getServerSideSession()]);

  if (!session) {
    return redirect('/');
  }

  const timings = {
    getBotBySlug: 0,
    getConversationById: 0,
    getConversationPreviewsForBot: 0,
  };

  const start = performance.now();
  const bot = await getBotBySlug(slug);
  timings.getBotBySlug = performance.now() - start;

  const start2 = performance.now();
  const conversation = await getConversationById(conversationId);
  timings.getConversationById = performance.now() - start2;

  if (!bot || !conversation) {
    redirect('/');
  }

  const start3 = performance.now();
  const conversationPreviews = await getConversationPreviewsForBot(bot);
  timings.getConversationPreviewsForBot = performance.now() - start3;

  return (
    <ChatConversation
      bot={bot}
      conversationPreviews={conversationPreviews}
      initialConversation={conversation}
      timings={timings}
    />
  );
}

async function getConversationById(id: string): Promise<Conversation | undefined> {
  if (!id) return;

  return db.query.conversations.findFirst({
    where: (table, { eq }) => eq(table.id, Number(id)),
  });
}
