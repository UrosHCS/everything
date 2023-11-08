import { StreamHandler } from './StreamHandler';
import { getConversationUrl } from './helpers';
import { ClientConversation, useConversation } from './useConversation';
import { useToast } from '@components/ui/use-toast';
import { signInWithGoogle } from '@lib/firebase';
import { useSession } from '@lib/firebase/context';
import { Bot } from '@lib/firebase/models';
import { Result, err, isErr, ok } from '@lib/result';
import { DocWithId } from '@lib/types';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useChat = (bot: DocWithId<Bot>, initialConversation?: ClientConversation) => {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  /**
   * True when the answer is being generated.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * The answer being generated.
   */
  const [streamingMessage, setStreamingMessage] = useState('');

  const { conversation, addQuestion, undoQuestion, addAnswer } = useConversation(initialConversation);

  async function ask(question: string): Promise<void> {
    if (!session.user) {
      if (session.status === 'loading') {
        return;
      }

      signInWithGoogle();
      return;
    }

    setIsLoading(true);

    addQuestion(question);

    const result = await getResponseStream(bot, session.user, question, initialConversation?.id);

    if (isErr(result)) {
      toast({
        title: 'Error',
        description: result.error,
      });
      setIsLoading(false);
      undoQuestion();
      return;
    }

    const stream = result.value;

    if (!stream) {
      toast({
        title: 'Error',
        description: 'No stream returned from the server.',
      });
      setIsLoading(false);
      undoQuestion();
      return;
    }

    const { message, conversationId, isNewConversation, isErrorMessage } = await new StreamHandler(
      stream,
      initialConversation?.id,
      chunk => setStreamingMessage(prev => prev + chunk),
    ).read();

    addAnswer(message);
    setStreamingMessage('');

    // If there is an error message, we keep the isLoading state to true
    // as to prevent the user from asking another question.
    if (!isErrorMessage) {
      setIsLoading(false);
    }

    if (isNewConversation) {
      router.replace(getConversationUrl(bot, { id: conversationId }));
    }
  }

  return { conversation, ask, streamingMessage, isLoading };
};

async function getResponseStream(
  bot: DocWithId<Bot>,
  user: User,
  question: string,
  conversationId?: string,
): Promise<Result<ReadableStreamDefaultReader<Uint8Array> | undefined, string>> {
  const token = await user.getIdToken();

  const res = await fetch('/api/ask', {
    method: 'POST',
    body: JSON.stringify({ question, slug: bot.slug, conversationId }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return err(await res.text());
  }

  if (!res.body) {
    return err('No body in response');
  }

  return ok(res.body.getReader());
}
