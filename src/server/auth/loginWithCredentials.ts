import { auth } from '../../lib/firebase';
import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';

export const loginWithCredentials = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};
