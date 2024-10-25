import { AuthenticationError } from './errors/AuthenticationError';
import { auth } from '@backend/firebase';

export const Auth = {
  /**
   * Verify the Authorization token in the request headers
   * and return the decoded token.
   */
  verify: async (request: Request) => {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) throw new AuthenticationError('No Authorization token provided');

    try {
      return await auth.verifyIdToken(token);
    } catch {
      throw new AuthenticationError('Invalid Authorization token');
    }
  },
};
