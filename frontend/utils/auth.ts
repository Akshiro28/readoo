import admin from 'firebase-admin';
import type { NextApiRequest } from 'next';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}'
);

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function authenticate(req: NextApiRequest) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw new Error('Missing token');
  }

  return await admin.auth().verifyIdToken(token);
}
