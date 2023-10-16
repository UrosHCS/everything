import { getConversationUrl } from './helpers';
import { repos } from '@backend/repositories/repos';
import { Bot, QnA } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';

export type ConversationPreview = {
  id: string;
  name: QnA['question']['body'];
  url: string;
};

export async function getBotBySlug(slug: string): Promise<DocWithId<Bot> | undefined> {
  if (!slug) return;

  return repos.bots.findOneBy('slug', slug);
}

export async function getConversationPreviewsForBot(bot: DocWithId<Bot>): Promise<ConversationPreview[]> {
  const res = await repos.conversations.ref.select('id', 'messages').where('botId', '==', bot.id).get();

  return res.docs.map(conversation => ({
    id: conversation.id,
    name: getName(conversation),
    url: getConversationUrl(bot, conversation),
  }));
}

function getName(conversation: any): string {
  const qna = conversation.get('messages') as QnA[];

  if (!qna.length) return '';

  return qna[0].question.body;
}
