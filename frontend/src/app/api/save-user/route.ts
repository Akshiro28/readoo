import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/db';
import { authenticate } from '../../utils/auth-app';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    const { email, name, photo } = await req.json();

    if (!email || !name || !photo) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
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

    return NextResponse.json({ message: 'User saved', result });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 401 });
    }

    console.error('Unexpected error', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

