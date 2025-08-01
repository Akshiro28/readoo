import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// ---------- FIREBASE ADMIN SETUP ----------
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// ---------- MONGODB SETUP ----------
const MONGODB_URI = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "readoo";

// You can use a global MongoClient across hot reloads in dev
const globalForMongo = global as any;
let client: MongoClient;

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = new MongoClient(MONGODB_URI);
}
client = globalForMongo.mongoClient;

// ---------- POST /api/user-books ----------
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

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

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("user_books");

    const filter = { uid, bookId };
    const existing = await collection.findOne(filter);
    const isMarked = existing?.status?.[statusKey] === true;

    const update = isMarked
      ? { $set: { [`status.${statusKey}`]: false } }
      : {
        $set: {
          [`status.${statusKey}`]: true,
          uid,
          bookId,
        },
      };

    await collection.updateOne(filter, update, { upsert: true });

    return NextResponse.json({
      message: isMarked ? `${statusKey} unmarked` : `${statusKey} marked`,
      newStatus: !isMarked,
    });
  } catch (err: any) {
    console.error("🔥 Error in POST /api/user-books:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ---------- GET /api/user-books?bookId=xyz ----------
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("user_books");

    const doc = await collection.findOne({ uid, bookId });
    const status = doc?.status || {
      read: false,
      favorite: false,
      wishlist: false,
    };

    return NextResponse.json({ status });
  } catch (err: any) {
    console.error("🔥 Error in GET /api/user-books:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

