import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET);

    return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { valid: false, message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
