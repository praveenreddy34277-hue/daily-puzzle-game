/**
 * Core puzzle framework types and interfaces
 */

export enum PuzzleType {
  ARITHMETIC = 'arithmetic',
  PATTERN_RECOGNITION = 'pattern_recognition',
  WORD_SCRAMBLE = 'word_scramble',
  MEMORY_GRID = 'memory_grid',
  LOGIC_ORDERING = 'logic_ordering',
}

export interface PuzzleMetadata {
  id: string;
  type: PuzzleType;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
}

export interface PuzzleState {
  puzzle: BasePuzzle;
  userAnswer: unknown;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  attempts: number;
  timeSpent: number; // in seconds
  startTime: number; // timestamp
}

export interface BasePuzzle {
  metadata: PuzzleMetadata;
  rules: string[];
  score: number;
}

export interface PuzzleGenerator {
  generate(seed: number): BasePuzzle;
}

export interface PuzzleRenderer {
  render(puzzle: BasePuzzle): JSX.Element;
}

export interface PuzzleValidator {
  validate(puzzle: BasePuzzle, userAnswer: unknown): { isCorrect: boolean; feedback: string };
}

export interface CompletePuzzle extends BasePuzzle, PuzzleGenerator, PuzzleRenderer, PuzzleValidator {
}

// User progress tracking
export interface UserProgress {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalPuzzlesSolved: number;
  completedDates: string[]; // ISO date strings
  totalScore: number;
  lastCompletedDate: string;
}

export interface DailyCompletion {
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  puzzleId: string;
  isCompleted: boolean;
  score: number;
  timeSpent: number; // in seconds
  attempts: number;
}
