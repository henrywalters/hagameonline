import admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  // Option 1: Using service account file
  const serviceAccount = await import(import.meta.env.FIREBASE_SERVICE_ACCOUNT_PATH);

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} else {
  app = admin.apps[0]!;
}

export const auth = admin.auth(app);