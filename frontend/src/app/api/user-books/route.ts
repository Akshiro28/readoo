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

// You can use a global MongoClient across hot reloads in dev
const globalForMongo = global as typeof globalThis & {
  mongoClient?: MongoClient;
};

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = new MongoClient(MONGODB_URI);
}

const client = globalForMongo.mongoClient;

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
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("user_books");

    const filter = { uid, bookId };
    const existing = await collection.findOne(filter);
    const isMarked = existing?.status?.[statusKey] === true;

    let update: any;

    if (statusKey === "read") {
      if (!existing?.status?.read) {
        // Only set read date if it's not already marked
        update = {
          $set: {
            "status.read": true,
            "status.readDate": new Date(), // store the first read date
            uid,
            bookId,
          },
        };
      } else {
        // unmark read without changing the date
        update = { $set: { "status.read": false } };
      }
    } else {
      // favorite or wishlist can toggle normally
      update = isMarked
        ? { $set: { [`status.${statusKey}`]: false } }
        : { $set: { [`status.${statusKey}`]: true, uid, bookId } };
    }

    await collection.updateOne(filter, update, { upsert: true });

    const updatedDoc = await collection.findOne(filter);

    const allFalse =
      !updatedDoc?.status?.read &&
        !updatedDoc?.status?.favorite &&
        !updatedDoc?.status?.wishlist;

    // Only delete if there is no readDate
    if (allFalse && !updatedDoc?.status?.readDate) {
      await collection.deleteOne(filter);
      return NextResponse.json({
        message: `${statusKey} unmarked — all statuses false, entry removed`,
        deleted: true,
      });
    }

    return NextResponse.json({
      message: isMarked ? `${statusKey} unmarked` : `${statusKey} marked`,
      newStatus: !isMarked,
      readDate: updatedDoc?.status?.readDate || null,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("Error in POST /api/user-books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
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
      readDate: null,
      favorite: false,
      wishlist: false,
    };

    return NextResponse.json({ status });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("Error in GET /api/user-books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
