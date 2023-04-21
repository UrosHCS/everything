import { firebase } from '../../config';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// https://firebase.google.com/docs/web/setup#available-libraries
const app = initializeApp(firebase);

export const auth = getAuth(app);
export const db = getFirestore(app);
