import { getConversationUrl } from './helpers';
import { repos } from '@backend/repositories/repos';
import { DocumentData, QueryDocumentSnapshot } from '@google-cloud/firestore';
import { Bot, QnA } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';

type C = QueryDocumentSnapshot<DocumentData, DocumentData>;

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

function getName(conversation: C): string {
  const qna = conversation.get('messages') as QnA[];

  if (!qna.length) return 'Empty conversation';

  return qna[0].question.body || 'Empty conversation';
}
