import { HTTPRequestError } from './errors/HTTPRequestError';

export function catchError(
  handler: (request: Request, response: Response) => Response | Promise<Response>,
): (request: Request, response: Response) => Promise<Response> {
  return async (request: Request, response: Response): Promise<Response> => {
    try {
      return await handler(request, response);
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
