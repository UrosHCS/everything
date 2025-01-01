import { getConversationUrl } from './helpers';
import { db } from '@backend/drizzle/db';
import { Bot, Conversation, QnA, bots, conversations } from '@backend/drizzle/schema';
import { eq } from 'drizzle-orm';

export type ConversationPreview = {
  id: number;
  name: QnA['question']['body'];
  url: string;
};

export async function getBotBySlug(slug: string): Promise<Bot | undefined> {
  if (!slug) return;

  return db.query.bots.findFirst({ where: eq(bots.slug, slug) });
}

export async function getConversationPreviewsForBot(bot: Bot): Promise<ConversationPreview[]> {
  const res = await db.query.conversations.findMany({
    where: eq(conversations.botId, bot.id),
    columns: { id: true, messages: true },
  });

  return res.map(conversation => ({
    id: conversation.id,
    name: getName(conversation),
    url: getConversationUrl(bot, conversation),
  }));
}

function getName(conversation: Pick<Conversation, 'id' | 'messages'>): string {
  const firstQnA = conversation.messages[0];

  return firstQnA?.question.body || 'Empty conversation';
}
