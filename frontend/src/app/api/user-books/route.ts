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

const dbName = process.env.MONGODB_DB_NAME || "readoo";

// POST handler
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const { bookId, statusKey } = await req.json();

    if (!bookId || !["read", "favorite", "wishlist"].includes(statusKey)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("user_books");

    const filter = { uid, bookId };
    const update = {
      $set: { [`status.${statusKey}`]: true, uid, bookId },
    };
    const options = { upsert: true };

    await collection.updateOne(filter, update, options);

    return NextResponse.json({ message: "Book status updated" });
  } catch (err) {
    console.error("Error in /api/user-books:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

