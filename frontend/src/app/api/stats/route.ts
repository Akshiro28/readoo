import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const client = new MongoClient(MONGODB_URI);
const dbName = process.env.MONGODB_DB;

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);

    const usersCollection = db.collection("users");
    const userBooksCollection = db.collection("user_books");

    const totalUsers = await usersCollection.countDocuments();
    const totalSavedBooks = await userBooksCollection.countDocuments();

    const averageBooks = totalUsers > 0 ? totalSavedBooks / totalUsers : 0;

    return NextResponse.json({
      totalUsers,
      totalSavedBooks,
      averageBooks: averageBooks.toFixed(2),
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
