import { Bot, Conversation } from '@backend/drizzle/schema';

export function getConversationUrl(bot: Pick<Bot, 'slug'>, conversation: Pick<Conversation, 'id'>) {
  return `/chat/${bot.slug}/conversation/${conversation.id}`;
}
