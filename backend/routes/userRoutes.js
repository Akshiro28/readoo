import express from 'express';
import { getDB } from '../config/mongo.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/save-user', authenticate, async (req, res) => {
  const { email, name, photo } = req.body;

  if (!email || !name || !photo) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const users = getDB().collection('users');
    const result = await users.updateOne(
      { uid: req.user.uid },
      {
        $set: {
          uid: req.user.uid,
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
    console.error('Failed to save user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

