import { MongoClient } from 'mongodb';

let db;

export async function connectToMongo() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    db = client.db(process.env.MONGODB_DB);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

export function getDB() {
  return db;
}

