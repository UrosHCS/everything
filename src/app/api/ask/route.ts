import { Auth } from '../Auth';
import catchError from '../catchError';
import { QnA } from '@lib/firebase/models';

async function handler(request: Request) {
  const decodedToken = await Auth.verify(request);

  const body = await request.json();
  const question = body.question ?? 'Nothing';

  const qna: QnA = {
    question: {
      body: question,
      createdAt: new Date().toISOString(),
    },
    answer: {
      body: `Hey ${decodedToken.name}! You asked: "${question}", but the answer doesn't really exist.`,
      createdAt: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(qna));
}

export const POST = catchError(handler);
