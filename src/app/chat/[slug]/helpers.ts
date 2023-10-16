import { Bot, Conversation } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';

export function getConversationUrl(bot: Pick<Bot, 'slug'>, conversation: Pick<DocWithId<Conversation>, 'id'>) {
  return `/chat/${bot.slug}/conversation/${conversation.id}`;
}
