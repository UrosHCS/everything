'use client';

import { ChatInput } from './ChatInput';
import Message from './Message';
import { useConversation } from './useConversation';
import { Card } from '@components/ui/card';
import { Bot } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { Fragment } from 'react';

type Props = {
  bot: DocWithId<Bot>;
};

export function Conversation({ bot }: Props) {
  const { conversation, ask, streamingMessage, isLoading } = useConversation(bot);

  return (
    <section className="flex h-full w-full max-w-xl flex-col overflow-y-hidden">
      <h2 className="py-4 text-3xl font-semibold opacity-80">{bot.name}</h2>

      <Card className="flex h-full flex-col overflow-y-hidden">
        <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
          <Message bot={true}>How may I help you today?</Message>
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
