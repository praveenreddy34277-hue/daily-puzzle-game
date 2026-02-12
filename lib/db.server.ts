/**
 * Database initialization and utilities for PostgreSQL
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function initializeDatabase() {
  try {
    let client;
    try {
      client = await pool.connect();
    } catch (connErr) {
      const msg = connErr instanceof Error ? connErr.message : String(connErr);
      console.warn('Database not available during initializeDatabase():', msg);
      // Do not throw here so build/export can proceed without an available DB
      return;
    }

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        avatar_url VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        current_streak INT DEFAULT 0,
        longest_streak INT DEFAULT 0,
        total_puzzles_solved INT DEFAULT 0,
        total_score INT DEFAULT 0,
        last_completed_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create daily completions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_completions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
        date DATE,
        puzzle_id VARCHAR(255),
        is_completed BOOLEAN DEFAULT FALSE,
        score INT DEFAULT 0,
        time_spent INT DEFAULT 0,
        attempts INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      );
    `);

    // Create indices
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_daily_completions_user_date 
      ON daily_completions(user_id, date);
    `);

    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't rethrow to avoid build-time failures; allow runtime to handle errors
    return;
  }
}

export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}
