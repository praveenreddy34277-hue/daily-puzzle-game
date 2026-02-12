import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { connectMongo } from '@/lib/mongo';
import { User } from '@/lib/models/User';
import { hash } from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const uname = String(username || '').trim().toLowerCase();
    console.log('[auth/signup] attempt:', uname);
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (uname.length < 3) {
      return NextResponse.json(
        { message: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }




    await connectMongo();

    const exists = await User.findOne({ username: uname }).lean();
    if (exists) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    await User.create({ username: uname, passwordHash });

    const token = sign({ username: uname, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: '2h' });
    return NextResponse.json({ token, username: uname }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
