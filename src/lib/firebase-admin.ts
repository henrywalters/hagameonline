import admin from 'firebase-admin';
import { readFileSync } from 'fs';

let app: admin.app.App;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(import.meta.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8")
  );

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} else {
  app = admin.apps[0]!;
}

export const auth = admin.auth(app);