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

  const [bot, conversation] = await Promise.all([getBotBySlug(slug), getConversationById(conversationId)]);

  if (!bot || !conversation) {
    redirect('/');
  }

  const conversationPreviews = await getConversationPreviewsForBot(bot);

  return <ChatConversation bot={bot} conversationPreviews={conversationPreviews} initialConversation={conversation} />;
}

async function getConversationById(id: string): Promise<Conversation | undefined> {
  if (!id) return;

  return db.query.conversations.findFirst({
    where: (table, { eq }) => eq(table.id, Number(id)),
  });
}
