import { signInWithGoogle } from '@lib/firebase';
import { useSession } from '@lib/firebase/context';
import { Bot, Conversation, QnA } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { User } from 'firebase/auth';
import { FormEvent, useCallback, useState } from 'react';

type UnauthenticatedConversation = {
  botId: string;
  createdAt: null;
  messages: QnA[];
  userId: null;
};

export const useConversation = (bot: DocWithId<Bot>) => {
  const session = useSession();

  /**
   * True when the answer is being generated.
   */
  const [isLoading, setIsLoading] = useState(false);
  /**
   * The answer being generated.
   */
  const [streamingMessage, setStreamingMessage] = useState('');

  /** @todo: useReducer */
  const [conversation, setConversation] = useState<Conversation | UnauthenticatedConversation>({
    botId: bot.id,
    createdAt: null,
    messages: [],
    userId: null,
  } satisfies UnauthenticatedConversation);

  const ask = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // @ts-expect-error maybe there's a better way
      const question = e.target.elements.question.value;

      if (!session.user) {
        if (session.status === 'loading') {
          return;
        }

        signInWithGoogle();
        return;
      }

      setIsLoading(true);

      // Remove the question from the input
      // @ts-expect-error maybe there's a better way
      e.target.elements.question.value = '';

      // And add the question to the conversation
      setConversation(old => {
        const now = new Date().toISOString();
        const message = { question: { body: question, createdAt: now } };

        return {
          botId: old.botId,
          createdAt: old.createdAt ?? now,
          userId: session.user.uid,
          messages: [...old.messages, message],
        };
      });

      const stream = await getResponseStream(bot, session.user, question);

      if (!stream) {
        setIsLoading(false);
        return;
      }

      let message = '';

      // Push the response to the streamed message
      while (true) {
        const { done, value } = await stream.read();
        if (done) break;

        const decoded = new TextDecoder('utf-8').decode(value);
        message += decoded;
        setStreamingMessage(prev => prev + decoded);
      }

      // Once the stream is done, set the streamed message as the last message in the conversation
      setConversation(old => {
        const newMessages = [...old.messages];
        newMessages[newMessages.length - 1].answer = { body: message, createdAt: new Date().toISOString() };
        return {
          ...old,
          messages: newMessages,
        };
      });

      // And remove the streamed message
      setStreamingMessage('');
      setIsLoading(false);
    },
    [bot, setStreamingMessage, setIsLoading, setConversation, session],
  );

  return { conversation, ask, streamingMessage, isLoading };
};

async function getResponseStream(bot: DocWithId<Bot>, user: User, question: string) {
  const token = await user.getIdToken();

  const res = await fetch('/api/ask', {
    method: 'POST',
    body: JSON.stringify({ question, slug: bot.slug }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.log('Error in response');
    return;
  }

  if (!res.body) {
    console.log('No body in response');
    return;
  }

  return res.body.getReader();
}
