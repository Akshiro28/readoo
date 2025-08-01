import admin from 'firebase-admin';
import type { NextRequest } from 'next/server';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}'
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export async function authenticate(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    throw new Error('Missing token');
  }

  return await admin.auth().verifyIdToken(token);
}
