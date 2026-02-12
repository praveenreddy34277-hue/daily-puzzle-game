/**
 * Deterministic seed generator for daily puzzles
 * Ensures all users get the same puzzle on the same day
 */

export function generateDailySeed(date: Date = new Date()): number {
  // Create a seed based on the date YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  // Convert to seed number
  let seed = parseInt(dateString, 10);
  
  // Apply a simple hash function for better distribution
  return Math.abs((seed * 9301 + 49297) % 233280);
}

/**
 * Seeded random number generator
 * Same seed produces same sequence
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextChoice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayDate(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDate();
}

/**
 * Parse ISO date string
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00Z');
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = parseISODate(date1);
  const d2 = parseISODate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
