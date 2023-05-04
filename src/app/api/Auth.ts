import { AuthenticationError } from './errors/AuthenticationError';
import { auth } from '@backend/firebase';

export const Auth = {
  verify: async (request: Request) => {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!idToken) throw new AuthenticationError('No Authorization token provided');

    try {
      return await auth.verifyIdToken(idToken);
    } catch (error) {
      throw new AuthenticationError('Invalid Authorization token');
    }
  },
};
