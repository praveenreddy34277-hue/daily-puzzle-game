/**
 * API route to save daily completion
 * POST /api/completion
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db.server';

export async function POST(request: NextRequest) {
  try {
    const { userId, date, puzzleId, isCompleted, score, timeSpent, attempts } =
      await request.json();

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing userId or date' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO daily_completions (user_id, date, puzzle_id, is_completed, score, time_spent, attempts)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, date) DO UPDATE SET
         puzzle_id = $3,
         is_completed = $4,
         score = $5,
         time_spent = $6,
         attempts = $7,
         created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, date, puzzleId || null, isCompleted || false, score || 0, timeSpent || 0, attempts || 0]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving completion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    let queryText = 'SELECT * FROM daily_completions WHERE user_id = $1';
    const params: any[] = [userId];

    if (date) {
      queryText += ' AND date = $2';
      params.push(date);
    }

    queryText += ' ORDER BY date DESC';

    const result = await query(queryText, params);

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching completions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
