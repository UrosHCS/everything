'use client';

import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import Message from './Message';
import { ConversationPreview } from './server';
import { useChat } from './useChat';
import { Card } from '@components/ui/card';
import { Bot, Conversation } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import Image from 'next/image';
import { Fragment } from 'react';

type Props = {
  bot: DocWithId<Bot>;
  initialConversation?: DocWithId<Conversation>;
  conversationPreviews: ConversationPreview[];
};

export function ChatConversation({ bot, initialConversation, conversationPreviews }: Props) {
  const { conversation, ask, streamingMessage, isLoading } = useChat(bot, initialConversation);

  return (
    <section className="flex h-full w-full max-w-xl flex-col overflow-y-hidden">
      <h2 className="flex gap-4 py-4 text-3xl font-semibold opacity-80">
        <ConversationSidebar conversationPreviews={conversationPreviews}>
          <Image
            className="rounded-full border-2 border-slate-700"
            src={bot.image}
            width={36}
            height={36}
            alt={bot.name}
            priority={true}
          />
        </ConversationSidebar>
        {bot.name}
      </h2>

      <Card className="mb-2 flex h-full flex-col overflow-y-hidden">
        <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
          <Message bot={true}>{bot.initialMessage}</Message>
          {conversation.messages.map((message, i) => {
            const isLastMessage = conversation.messages.length === i + 1;
            const answer = (isLastMessage && streamingMessage) || message.answer?.body;

            return (
              <Fragment key={i}>
                <Message bot={false}>{message.question.body}</Message>
                {answer && <Message bot={true}>{answer}</Message>}
              </Fragment>
            );
          })}
        </div>

        <ChatInput ask={ask} shouldDisable={isLoading} />
      </Card>
    </section>
  );
}
