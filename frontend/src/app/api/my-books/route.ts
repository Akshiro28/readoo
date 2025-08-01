import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const MONGODB_URI = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "readoo";
const globalForMongo = global as typeof globalThis & { mongoClient?: MongoClient };

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = new MongoClient(MONGODB_URI);
}

const client = globalForMongo.mongoClient;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("user_books");

    const docs = await collection
      .find({
        uid,
        $or: [
          { "status.read": true },
          { "status.favorite": true },
          { "status.wishlist": true },
        ],
      })
      .toArray();

    return NextResponse.json(docs);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("Error in GET /api/my-books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

