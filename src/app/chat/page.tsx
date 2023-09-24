'use client';

import Message from './Message';
import { useConversation } from './useConversation';
import { useSession } from '@lib/firebase/context';
import { Fragment } from 'react';

export default function Chat() {
  const session = useSession();

  const { conversation, question, setQuestion, ask, streamingMessage } = useConversation();

  if (session.status === 'loading') return <div>Loading...</div>;

  if (session.status === 'unauthenticated') return <div>Unauthenticated</div>;

  return (
    <section className="flex h-full w-full max-w-xl flex-col overflow-y-hidden">
      <h2 className="py-4 text-3xl font-semibold">Druzzila</h2>

      <div className="flex h-full flex-col overflow-y-hidden rounded-lg border border-purple-500 bg-purple-800">
        <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
          <Message bot={true}>How may I help you, dear?</Message>
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

        <div className="p-2">
          <form className="relative" onSubmit={ask}>
            <input
              className="w-full rounded-lg border border-purple-500 bg-gradient-to-r from-purple-500 to-fuchsia-400 p-2 pr-10 text-purple-700"
              name="question"
              id="question"
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            <button className="absolute inset-y-0 right-0 pr-2 text-purple-950" type="submit">
              Ask
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
