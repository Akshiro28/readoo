import { connectToDatabase } from '../../utils/db.js';
import { authenticate } from '../../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const user = await authenticate(req);
    const { email, name, photo } = req.body;

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

    res.status(200).json({ message: 'User saved', result });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message });
  }
}

