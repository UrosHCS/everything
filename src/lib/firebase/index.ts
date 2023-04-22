import { config } from '@config';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  type User,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export type { User };

// https://firebase.google.com/docs/web/setup#available-libraries
const app = initializeApp(config.firebase);

export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

/**
 * Opens a popup window to sign in with Google.
 */
export async function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

/**
 * Signs in with email and password.
 */
export function loginWithCredentials(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
