import { serverConfig } from './serverConfig';
import admin from 'firebase-admin';

const { serviceAccount } = serverConfig.firebaseAdmin;

const app = (() => {
  if (admin.apps.length) return admin.app();

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
    }),
  });
})();

const firestoreInstance = admin.firestore(app);
const auth = admin.auth(app);

export { app, auth, firestoreInstance };
