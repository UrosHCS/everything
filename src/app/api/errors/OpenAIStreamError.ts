import { HTTPRequestError } from './HTTPRequestError';

export class OpenAIStreamError extends HTTPRequestError {
  constructor(message: string) {
    super(message, 502);
  }
}
