import { catchError } from '../catchError';

async function handler() {
  return new Response('OK', { status: 200 });
}

export const POST = catchError(handler);
