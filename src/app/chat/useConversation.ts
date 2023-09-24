import { useSession } from '@lib/firebase/context';
import { Conversation, QnA } from '@lib/firebase/models';
import { User } from 'firebase/auth';
import { FormEvent, useCallback, useState } from 'react';

type UnauthenticatedConversation = {
  botId: string;
  createdAt: null;
  messages: QnA[];
  userId: null;
};

const emptyConversation: UnauthenticatedConversation = {
  botId: '1',
  createdAt: null,
  messages: [],
  userId: null,
};

export const useConversation = () => {
  const { user } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | UnauthenticatedConversation>(emptyConversation);

  const [question, setQuestion] = useState('');

  const ask = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      console.log('ask');
      e.preventDefault();

      if (!user) return;

      setIsLoading(true);

      // Remove the question from the input
      setQuestion('');
      // And add the question to the conversation
      setConversation(old => {
        const now = new Date().toISOString();
        const message = { question: { body: question, createdAt: now } };

        return {
          botId: old.botId,
          createdAt: old.createdAt ?? now,
          userId: user.uid,
          messages: [...old.messages, message],
        };
      });

      const stream = await getResponseStream(user, question);

      if (!stream) {
        setIsLoading(false);
        return;
      }

      let message = '';

      // Push the response to the streamed message
      while (true) {
        console.log('.');
        const { done, value } = await stream.read();
        if (done) break;

        const decoded = new TextDecoder('utf-8').decode(value);
        message += decoded;
        setStreamingMessage(prev => prev + decoded);
      }

      console.log('gonna set conversation');
      // Once the stream is done, set the streamed message as the last message in the conversation
      setConversation(old => {
        console.log('setting conversation');
        const newMessages = [...old.messages];
        newMessages[newMessages.length - 1].answer = { body: message, createdAt: new Date().toISOString() };
        console.log({
          old,
          new: {
            ...old,
            messages: newMessages,
          },
        });
        return {
          ...old,
          messages: newMessages,
        };
      });

      // And remove the streamed message
      setStreamingMessage('');
      setIsLoading(false);
    },
    [setStreamingMessage, setConversation, question, user],
  );

  return { conversation, question, setQuestion, ask, streamingMessage, isLoading };
};

async function getResponseStream(user: User, question: string) {
  const token = await user.getIdToken();

  const res = await fetch('/api/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
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
