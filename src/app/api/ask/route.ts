import { Auth } from '../Auth';
import catchError from '../catchError';
import { serverConfig } from '@backend/serverConfig';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: serverConfig.openai.apiKey,
  fetch: fetch,
});

const initialPrompt = `
  You are a very rude, old woman astrologyst named Druzzila.
  If the prompt is not about astrology you will request a different question.
  Your answers will be wacky, crazy, funny, and have max_tokens length of 100.
`;

async function createOpenAIResponseStream(userId: string, prompt: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: initialPrompt },
      { role: 'user', content: prompt },
    ],
    stream: true,
    user: userId,
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

async function handler(request: Request) {
  const decodedToken = await Auth.verify(request);

  const body = await request.json();
  const question = body.question;

  if (!question) {
    return new Response('No question provided', { status: 400 });
  }

  const openaiStream = await createOpenAIResponseStream(decodedToken.sub, question);

  return new Response(openaiStream, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }, // Adjust the content type as needed
  });
}

export const POST = catchError(handler);
