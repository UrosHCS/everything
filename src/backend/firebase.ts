import { serverConfig } from './serverConfig';
import admin from 'firebase-admin';

const { serviceAccount } = serverConfig.firebaseAdmin;

const firebase = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  }),
});

const firestoreInstance = admin.firestore(firebase);

export { firebase, firestoreInstance };
