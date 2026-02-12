/**
 * API route for health check and database init
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { initializeDatabase, query } from '@/lib/db.server';

export async function GET() {
  try {
    // Try to initialize database
    await initializeDatabase();

    // Run a simple query to verify connection
    const result = await query('SELECT NOW()');

    return NextResponse.json({
      status: 'healthy',
      timestamp: result.rows[0].now,
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
