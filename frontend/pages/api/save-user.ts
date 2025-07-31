import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/db';
import { authenticate } from '../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const user = await authenticate(req);
    const { email, name, photo } = req.body as {
      email?: string;
      name?: string;
      photo?: string;
    };

    if (!email || !name || !photo) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { db } = await connectToDatabase();
    const users = db.collection('users');

    const result = await users.updateOne(
      { uid: user.uid },
      {
        $set: {
          uid: user.uid,
          email,
          name,
          photo,
          lastLogin: new Date(),
        },
      },
      { upsert: true }
    );

    return res.status(200).json({ message: 'User saved', result });
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ error: err.message || 'Unauthorized' });
  }
}
