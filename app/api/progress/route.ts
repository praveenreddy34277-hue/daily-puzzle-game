/**
 * API route to sync user progress to server
 * POST /api/progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db.server';

export async function POST(request: NextRequest) {
  try {
    const { userId, progress } = await request.json();

    if (!userId || !progress) {
      return NextResponse.json(
        { error: 'Missing userId or progress' },
        { status: 400 }
      );
    }

    // Verify user exists or create if not
    const userCheckResult = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );

    if (userCheckResult.rows.length === 0) {
      // User doesn't exist, create minimal record
      await query(
        'INSERT INTO users (id, email, name) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
        [userId, null, null]
      );
    }

    // Upsert user progress
    const result = await query(
      `INSERT INTO user_progress (user_id, current_streak, longest_streak, total_puzzles_solved, total_score, last_completed_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         current_streak = $2,
         longest_streak = $3,
         total_puzzles_solved = $4,
         total_score = $5,
         last_completed_date = $6,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        userId,
        progress.currentStreak || 0,
        progress.longestStreak || 0,
        progress.totalPuzzlesSolved || 0,
        progress.totalScore || 0,
        progress.lastCompletedDate || null,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error syncing progress:', error);
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

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT * FROM user_progress WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalPuzzlesSolved: 0,
        totalScore: 0,
        lastCompletedDate: null,
      });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
