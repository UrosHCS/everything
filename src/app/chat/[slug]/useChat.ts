import { StreamHandler } from './StreamHandler';
import { getConversationUrl } from './helpers';
import { useConversation } from './useConversation';
import { Bot, Conversation } from '@backend/drizzle/schema';
import { useToast } from '@components/ui/use-toast';
import { Result, err, isErr, ok } from '@lib/result';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useChat = (bot: Bot, initialConversation?: Conversation) => {
  const { data } = useSession();

  const user = data?.user;

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
    if (!user) {
      return;
    }

    setIsLoading(true);

    addQuestion(question);

    const result = await getResponseStream(bot, question, initialConversation?.id);

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
  bot: Bot,
  question: string,
  conversationId?: number,
): Promise<Result<ReadableStreamDefaultReader<Uint8Array> | undefined, string>> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    body: JSON.stringify({ question, slug: bot.slug, conversationId }),
    headers: {
      'Content-Type': 'application/json',
      // Should be set by next-auth
      // Authorization: `Bearer ${token}`,
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
