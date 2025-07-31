import { getAuth } from "firebase-admin/auth";
import { getApp, getApps, initializeApp, cert } from "firebase-admin/app";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB_NAME || "readoo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;
    const { bookId, statusKey } = req.body as {
      bookId: string;
      statusKey: "read" | "favorite" | "wishlist";
    };

    if (!bookId || !["read", "favorite", "wishlist"].includes(statusKey)) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("user_books");

    const filter = { uid, bookId };
    const update = {
      $set: { [`status.${statusKey}`]: true, uid, bookId },
    };
    const options = { upsert: true };

    await collection.updateOne(filter, update, options);

    res.status(200).json({ message: "Book status updated" });
  } catch (err) {
    console.error("Error in /api/user-books:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
