import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(
  await readFile(path.join(__dirname, 'firebase-service-account.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const client = new MongoClient(process.env.MONGODB_URI);
let db;

try {
  await client.connect();
  db = client.db(process.env.MONGODB_DB);
  console.log('MongoDB connected');
} catch (err) {
  console.error('MongoDB connection error:', err);
}

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ error: 'Invalid token' });
  }
}

app.post('/api/save-user', authenticate, async (req, res) => {
  const { email, name, photo } = req.body;

  if (!email || !name || !photo) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const users = db.collection('users');
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

    console.log('Sending user info:', {
        email,
        name,
        photo,
        uid: req.user.uid,
    });

    res.status(200).json({ message: 'User saved', result });

    } catch (err) {
    console.error('Failed to save user:', err);
    res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
