import { Auth } from '../Auth';
import { catchError } from '../catchError';
import { OpenAIStreamError } from '../errors/OpenAIStreamError';
import { modelNotFoundResponse } from './modelNotFoundResponse';
import { repos } from '@backend/repositories/repos';
import { serverConfig } from '@backend/serverConfig';
import { Bot, Conversation, User } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { OpenAI, OpenAIError } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const MAX_TOKENS = 150;

const openai = new OpenAI({
  apiKey: serverConfig.openai.apiKey,
  fetch: fetch,
});

/**
 * This should make the route work on Edge.
 * It doesn't because a lot of libraries that are used here are not supported on Edge.
 */
// export const runtime = 'edge';

export const POST = catchError(handler);

async function handler(request: Request) {
  const decodedToken = await Auth.verify(request);

  const { question, slug, conversationId } = await request.json();

  if (!question) {
    return new Response('No question provided', { status: 400 });
  }

  if (!slug) {
    return new Response('No gifted one provided', { status: 400 });
  }

  const [bot, user, conversation] = await Promise.all([
    repos.bots.findOneWhere({ slug, enabled: true }),
    repos.users.findById(decodedToken.sub),
    conversationId ? repos.conversations.findById(conversationId) : undefined,
  ]);

  if (!bot) {
    return modelNotFoundResponse('The gifted one', slug);
  }

  // if (!user) {
  // return modelNotFoundResponse('User', decodedToken.sub);
  // }

  // Quickest, stupidest solution
  const userOrDefault: DocWithId<User> = user ?? {
    id: 'temp',
    name: 'John',
    gender: 'male',
    dob: '2000-10-20',
    image: '',
    createdAt: '2024-01-12',
  };

  const newConversation = makeNewConversation(userOrDefault, bot);

  const openaiStream = await createOpenAIResponseStream(userOrDefault, conversation ?? newConversation, question);

  return new Response(openaiStream, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }, // Adjust the content type as needed
  });
}

function makeNewConversation(user: DocWithId<User>, bot: DocWithId<Bot>): Conversation {
  return {
    botId: bot.id,
    createdAt: new Date().toISOString(),
    messages: [],
    systemPrompt: getSystemPrompt(user, bot),
    userId: user.id,
  };
}

function getSystemPrompt(user: User, bot: Bot): string {
  return `${bot.prompt} Your answers should have max ${MAX_TOKENS} tokens. ${getUserPrompt(user)}`;
}

async function openStreamWithOpenAI(
  user: DocWithId<User>,
  existingOrNewConversation: DocWithId<Conversation> | Conversation,
  question: string,
) {
  const messages = getOpenaiMessages(existingOrNewConversation);

  try {
    return openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: existingOrNewConversation.systemPrompt },
        ...messages,
        { role: 'user', content: question },
      ],
      stream: true,
      user: user.id,
      max_tokens: MAX_TOKENS,
    });
  } catch (error) {
    console.error('There was an error while opening the stream with OpenAI');
    console.error(error);
    throw new OpenAIStreamError('There was an error while opening the stream with OpenAI');
  }
}

async function createOpenAIResponseStream(
  user: DocWithId<User>,
  /**
   * The conversation param is either an existing conversation (with an id)
   * or a new conversation object (without an id), ready to be saved to the database.
   */
  existingOrNewConversation: DocWithId<Conversation> | Conversation,
  question: string,
) {
  // First, open a stream with OpenAI
  const stream = await openStreamWithOpenAI(user, existingOrNewConversation, question);

  // Only if it succeeds, create a conversation.
  const conversation = await createNewConversationIfNeeded(existingOrNewConversation);

  return new ReadableStream({
    async start(controller) {
      let answer = '';
      try {
        // Send the conversation id to the client, so that it can redirect to the conversation page.
        controller.enqueue(`conversationId:${conversation.id}:`);

        for await (const part of stream) {
          const chunk = part.choices[0]?.delta?.content;
          if (chunk) {
            controller.enqueue(chunk);
            answer += chunk;
          }
        }
        // Before closing the controller we mush make sure to add the question and answer to the conversation.
        // So that when the client redirects to the conversation page, the question and answer are already there.
        await addQuestionAndAnswerToConversation(conversation, question, answer);
      } catch (error) {
        console.error('There was an erro while streaming the response from OpenAI');
        console.error(error);
        controller.error(error);
      }
      controller.close();
    },
    async cancel() {
      // We don't want to abort the stream, because we want to keep the conversation in the database.
      // stream.controller.abort();
    },
  });
}

function getOpenaiMessages(conversation: DocWithId<Conversation> | Conversation): ChatCompletionMessageParam[] {
  const messages: ChatCompletionMessageParam[] = [];

  conversation.messages.forEach(message => {
    messages.push({ role: 'user', content: message.question.body });
    if (message.answer) {
      messages.push({ role: 'assistant', content: message.answer.body });
    }
  });

  return messages;
}

function getUserPrompt(user: User): string {
  const gender = user.gender || 'person';
  const name = user.name ? ` named ${user.name}` : '';
  const dateOfBirth = user.dob ? `, born on ${user.dob.toDate().toDateString()}` : '';

  return `You are talking to a ${gender}${name}${dateOfBirth}.`;
}

async function createNewConversationIfNeeded(
  existingOrNewConversation: DocWithId<Conversation> | Conversation,
): Promise<DocWithId<Conversation>> {
  if ('id' in existingOrNewConversation) {
    return existingOrNewConversation;
  }

  return repos.conversations.create(existingOrNewConversation);
}

function addQuestionAndAnswerToConversation(
  conversation: DocWithId<Conversation>,
  question: string,
  answer: string,
): Promise<void> {
  return repos.conversations.addToArray(conversation.id, 'messages', {
    question: { body: question, createdAt: conversation.createdAt },
    answer: { body: answer, createdAt: new Date().toISOString() },
  });
}
