import { catchError } from '../catchError';
import { OpenAIStreamError } from '../errors/OpenAIStreamError';
import { modelNotFoundResponse } from './modelNotFoundResponse';
import { getServerSideSession } from '@backend/auth/getServerSideSession';
import { db } from '@backend/drizzle/db';
import { Bot, Conversation, ConversationInsert, User, bots, conversations, users } from '@backend/drizzle/schema';
import { serverConfig } from '@backend/serverConfig';
import { Content, GoogleGenerativeAI } from '@google/generative-ai';
import { and, eq, sql } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(serverConfig.googleai.apiKey);

const MAX_TOKENS = 150;

const model = genAI.getGenerativeModel({
  model: serverConfig.googleai.model,
  generationConfig: {
    maxOutputTokens: MAX_TOKENS,
  },
});

export const POST = catchError(handler);

async function handler(request: Request) {
  const session = await getServerSideSession();
  const email = session?.user?.email;

  if (!session) {
    return new Response('No session found with getServerSideSession', { status: 401 });
  }

  if (!email) {
    return new Response('No email found in session', { status: 401 });
  }

  const { question, slug, conversationId } = await request.json();

  if (!question) {
    return new Response('No question provided', { status: 400 });
  }

  if (!slug) {
    return new Response('No gifted one provided', { status: 400 });
  }

  const [bot, user, conversation] = await Promise.all([
    db.query.bots.findFirst({ where: and(eq(bots.slug, slug), eq(bots.enabled, true)) }),
    db.query.users.findFirst({ where: eq(users.email, email) }),
    conversationId ? db.query.conversations.findFirst({ where: eq(conversations.id, conversationId) }) : undefined,
  ]);

  if (!bot) {
    return modelNotFoundResponse('The gifted one', slug);
  }

  if (!user) {
    return modelNotFoundResponse('User', email);
  }

  const openaiStream = await createOpenAIResponseStream(conversation ?? makeNewConversation(user, bot), question);

  return new Response(openaiStream, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}

function makeNewConversation(user: User, bot: Bot): ConversationInsert {
  return {
    botId: bot.id,
    createdAt: new Date(),
    messages: [],
    systemPrompt: getSystemPrompt(user, bot),
    userId: user.id,
  };
}

function getSystemPrompt(user: User, bot: Bot): string {
  return `${bot.prompt} Your answers should have max ${MAX_TOKENS} tokens. ${getUserPrompt(user)}`;
}

async function openStreamWithAI(existingOrNewConversation: Conversation | ConversationInsert, question: string) {
  const messages = getAiMessages(existingOrNewConversation.messages);

  try {
    const stream = await model.generateContentStream({
      systemInstruction: existingOrNewConversation.systemPrompt,
      contents: [...messages, { role: 'user', parts: [{ text: question }] }],
    });

    return stream.stream;
  } catch (error) {
    console.error('There was an error while opening the stream with Gemini');
    console.error(error);
    throw new OpenAIStreamError('There was an error while opening the stream with Gemini');
  }
}

async function createOpenAIResponseStream(
  /**
   * The conversation param is either an existing conversation (with an id)
   * or a new conversation object (without an id), ready to be saved to the database.
   */
  existingOrNewConversation: Conversation | ConversationInsert,
  question: string,
) {
  // First, open a stream with AI model
  const stream = await openStreamWithAI(existingOrNewConversation, question);

  // Only if it succeeds, create a conversation.
  const conversation = await createNewConversationIfNeeded(existingOrNewConversation);

  return new ReadableStream({
    async start(controller) {
      let answer = '';
      try {
        // Send the conversation id to the client, so that it can redirect to the conversation page.
        controller.enqueue(`conversationId:${conversation.id}:`);

        for await (const part of stream) {
          const chunk = part.candidates?.[0]?.content.parts[0].text;
          if (chunk) {
            controller.enqueue(chunk);
            answer += chunk;
          }
        }
        // Before closing the controller we must make sure to add the question and answer to the conversation.
        // So that when the client redirects to the conversation page, the question and answer are already there.
        await addQuestionAndAnswerToConversation(conversation, question, answer);
      } catch (error) {
        console.error('There was an error while streaming the response from OpenAI');
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

function getAiMessages(conversationMessages: ConversationInsert['messages']): Content[] {
  const messages: Content[] = [];

  conversationMessages?.forEach(message => {
    messages.push({ role: 'user', parts: [{ text: message.question.body }] });
    if (message.answer) {
      messages.push({ role: 'assistant', parts: [{ text: message.answer.body }] });
    }
  });

  return messages;
}

function getUserPrompt(user: User): string {
  const gender = user.gender || 'person';
  const name = user.name ? ` named ${user.name}` : '';
  const dateOfBirth = user.dob ? `, born on ${user.dob.toDateString()}` : '';
  const nameExplanation = user.name ? ' Use the first name only, if both first and last name are provided.' : '';
  const languagePrompt = "Always respond in the same language as the last user's message.";

  return `You are talking to a ${gender}${name}${dateOfBirth}.${nameExplanation} ${languagePrompt}`;
}

async function createNewConversationIfNeeded(
  existingOrNewConversation: Conversation | ConversationInsert,
): Promise<Conversation> {
  if ('id' in existingOrNewConversation) {
    return existingOrNewConversation;
  }

  const rows = await db.insert(conversations).values(existingOrNewConversation).returning();

  return rows[0];
}

async function addQuestionAndAnswerToConversation(
  conversation: Conversation,
  question: string,
  answer: string,
): Promise<void> {
  await db.update(conversations).set({
    messages: sql`${conversations.messages} || ${JSON.stringify([
      {
        question: { body: question, createdAt: conversation.createdAt },
        answer: { body: answer, createdAt: new Date() },
      },
    ])}::jsonb`,
  });
}
