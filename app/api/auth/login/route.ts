import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { connectMongo } from '@/lib/mongo';
import { User } from '@/lib/models/User';
import { compare } from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const uname = String(username || '').trim().toLowerCase();

    if (!uname || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    await connectMongo();

    const user = await User.findOne({ username: uname }).lean();
    if (!user) {
      return NextResponse.json({ message: 'user-not-found' }, { status: 401 });
    }

    const ok = await compare(password, (user as any).passwordHash);
    if (!ok) {
      return NextResponse.json({ message: 'password-mismatch' }, { status: 401 });
    }

    const token = sign({ username: uname, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: '2h' });
    return NextResponse.json({ token, username: uname }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
