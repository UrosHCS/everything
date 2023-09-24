import { AuthenticationError } from './errors/AuthenticationError';
import { auth } from '@backend/firebase';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const Auth = {
  /**
   * Verify the Authorization token in the request headers
   * and return the decoded token.
   */
  verify: async (request: Request): Promise<DecodedIdToken> => {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) throw new AuthenticationError('No Authorization token provided');

    try {
      return await auth.verifyIdToken(token);
    } catch (error) {
      throw new AuthenticationError('Invalid Authorization token');
    }
  },
};
