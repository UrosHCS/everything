import { Auth } from '../Auth';
import catchError from '../catchError';
import { repos } from '@backend/repositories/repos';
import { serverConfig } from '@backend/serverConfig';
import { User } from '@lib/firebase/models';
import { DocWithId } from '@lib/types';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: serverConfig.openai.apiKey,
  fetch: fetch,
});

export const POST = catchError(handler);

async function handler(request: Request) {
  const decodedToken = await Auth.verify(request);

  const { question, slug } = await request.json();

  if (!question) {
    return new Response('No question provided', { status: 400 });
  }

  if (!slug) {
    return new Response('No gifted one provided', { status: 400 });
  }

  /** @todo: where enabled is true */
  const bot = await repos.bots.findOneBy('slug', slug);

  if (!bot) {
    return new Response(`The gifted one "${slug} not found`, { status: 404 });
  }

  const user = await repos.users.findById(decodedToken.sub);

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  const openaiStream = await createOpenAIResponseStream(user, question, bot.prompt);

  return new Response(openaiStream, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }, // Adjust the content type as needed
  });
}

async function createOpenAIResponseStream(user: DocWithId<User>, question: string, prompt: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: prompt },
      { role: 'user', content: 'Your answers should have max 100 tokens' },
      { role: 'user', content: getUserPrompt(user) },
      { role: 'user', content: question },
    ],
    stream: true,
    user: user.id,
    max_tokens: 100,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const part of stream) {
          const chunk = part.choices[0]?.delta?.content;
          chunk && controller.enqueue(chunk);
        }
      } catch (error) {
        controller.error(error);
      }
      controller.close();
    },
    async cancel() {
      stream.controller.abort();
    },
  });
}

function getUserPrompt(user: User): string {
  const name = user.name ? `a person named ${user.name}` : 'a person';
  const genderPrompt = user.gender ? ` of gender ${user.gender}` : ' of unknown gender';
  const dateOfBirth = user.dob ? ` born on ${user.dob}` : '';

  return `You are chatting with ${name}${genderPrompt}${dateOfBirth}`;
}
