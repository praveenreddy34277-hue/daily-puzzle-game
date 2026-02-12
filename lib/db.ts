/**
 * IndexedDB storage layer for client-side persistence
 * Stores user progress, puzzle state, and session data
 */

import Dexie, { Table } from 'dexie';
import { UserProgress, DailyCompletion, PuzzleState } from './types';

class PuzzleGameDB extends Dexie {
  userProgress!: Table<UserProgress>;
  dailyCompletions!: Table<DailyCompletion>;
  puzzleStates!: Table<PuzzleState>;

  constructor() {
    super('PuzzleGameDB');
    this.version(1).stores({
      userProgress: 'userId',
      dailyCompletions: '[userId+date]',
      puzzleStates: '[userId+date]',
    });
  }
}

export const db = new PuzzleGameDB();

/**
 * Get or create user progress record
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
  let progress = await db.userProgress.get(userId);
  
  if (!progress) {
    progress = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalPuzzlesSolved: 0,
      completedDates: [],
      totalScore: 0,
      lastCompletedDate: '',
    };
    await db.userProgress.add(progress);
  }
  
  return progress;
}

/**
 * Update user progress
 */
export async function updateUserProgress(progress: UserProgress): Promise<void> {
  await db.userProgress.put(progress);
}

/**
 * Get daily completion record
 */
export async function getDailyCompletion(
  userId: string,
  date: string
): Promise<DailyCompletion | undefined> {
  return db.dailyCompletions.get([userId, date]);
}

/**
 * Save daily completion
 */
export async function saveDailyCompletion(completion: DailyCompletion): Promise<void> {
  await db.dailyCompletions.put(completion);
}

/**
 * Get puzzle state for today
 */
export async function getPuzzleState(userId: string, date: string): Promise<PuzzleState | undefined> {
  return db.puzzleStates.get([userId, date]);
}

/**
 * Save puzzle state
 */
export async function savePuzzleState(userId: string, date: string, state: Omit<PuzzleState, 'userId' | 'date'>): Promise<void> {
  const puzzleState: PuzzleState = {
    ...state,
    userId,
    date,
  } as any;
  
  await db.puzzleStates.put(puzzleState);
}

/**
 * Clear all user data (for logout)
 */
export async function clearUserData(userId: string): Promise<void> {
  await db.userProgress.delete(userId);
  await db.dailyCompletions.where('userId').equals(userId).delete();
  await db.puzzleStates.where('userId').equals(userId).delete();
}

/**
 * Get all completions for a user
 */
export async function getAllCompletions(userId: string): Promise<DailyCompletion[]> {
  return db.dailyCompletions.where('userId').equals(userId).toArray();
}
