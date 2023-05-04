import { HTTPRequestError } from './errors/HTTPRequestError';

export default function catchError(
  handler: (request: Request) => Response | Promise<Response>,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request);
    } catch (error) {
      return handleError(error);
    }
  };
}

function handleError(error: unknown): Response {
  if (error instanceof HTTPRequestError) {
    return new Response(error.message, { status: error.status });
  }

  console.error(error);

  return new Response('Internal server error.', { status: 500 });
}
