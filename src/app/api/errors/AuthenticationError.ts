import { HTTPRequestError } from './HTTPRequestError';

export class AuthenticationError extends HTTPRequestError {
  constructor(message: string) {
    super(message, 401);
  }
}
