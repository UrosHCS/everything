'use client';

import Message from './Message';
import { useSession } from '@lib/firebase/context';
import { Conversation, QnA } from '@lib/firebase/models';
import { FormEvent, useEffect, useState } from 'react';

type UnauthenticatedConversation = {
  botId: string;
  createdAt: null;
  messages: QnA[];
  userId: null;
};

const emptyConversation: UnauthenticatedConversation = {
  botId: '1',
  createdAt: null,
  messages: [
    {
      question: {
        body: 'Hello there',
        createdAt: new Date().toISOString(),
      },
      answer: {
        body: 'Hello there Hello there Hello there Hello there Hello there Hello there Hello there',
        createdAt: new Date().toISOString(),
      },
    },
    {
      question: {
        body: 'Hello there',
        createdAt: new Date().toISOString(),
      },
      answer: {
        body: 'Hello there Hello there Hello there Hello there Hello there Hello there Hello there',
        createdAt: new Date().toISOString(),
      },
    },
    {
      question: {
        body: 'Hello there',
        createdAt: new Date().toISOString(),
      },
      answer: {
        body: 'Hello there Hello there Hello there Hello there Hello there Hello there Hello there',
        createdAt: new Date().toISOString(),
      },
    },
    {
      question: {
        body: 'Hello there',
        createdAt: new Date().toISOString(),
      },
      answer: {
        body: 'Hello there Hello there Hello there Hello there Hello there Hello there Hello there',
        createdAt: new Date().toISOString(),
      },
    },
  ],
  userId: null,
};

export default function Chat() {
  const session = useSession();

  const [conversation, setConversation] = useState<Conversation | UnauthenticatedConversation>(emptyConversation);

  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (!session.user) return;

    setConversation(emptyConversation);
  }, [session.user]);

  if (session.status === 'loading') return <div>Loading...</div>;

  if (session.status === 'unauthenticated') return <div>Unauthenticated</div>;

  const user = session.user;

  function ask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cachedQuestion = question;
    setQuestion('');
    setConversation(old => {
      const now = new Date().toISOString();
      const message = { question: { body: cachedQuestion, createdAt: now } };

      return {
        botId: old.botId,
        createdAt: old.createdAt ?? now,
        userId: user.uid,
        messages: [...old.messages, message],
      };
    });

    user
      .getIdToken()
      .then(token => {
        return fetch('/api/ask', {
          method: 'POST',
          body: JSON.stringify({ question: cachedQuestion }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then(res => res.json() as Promise<QnA>)
      .then(message => {
        setConversation(old => {
          const newMessages = [...old.messages];
          newMessages[newMessages.length - 1] = message;
          return {
            ...old,
            messages: newMessages,
          };
        });
      });
  }

  return (
    <section className="flex w-full grow flex-col lg:w-1/2">
      <h2 className="py-4 text-3xl font-semibold">Druzila</h2>

      <div className="flex grow flex-col gap-2 rounded-lg border border-purple-500 bg-purple-800 p-4">
        <div className="flex max-h-full grow flex-col gap-2 overflow-auto">
          <Message bot={true}>How may I help you, dear?</Message>
          {conversation.messages.map((message, i) => {
            return (
              <>
                <Message key={`q${i}`} bot={false}>
                  {message.question.body}
                </Message>
                {message.answer && (
                  <Message key={`a${i}`} bot={true}>
                    {message.answer.body}
                  </Message>
                )}
              </>
            );
          })}
        </div>

        <div className="pt-2">
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
