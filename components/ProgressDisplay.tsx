/**
 * Progress Display Component
 * Shows user streak, score, and completion status
 */

'use client';

import React from 'react';
import { UserProgress } from '@/lib/types';

interface ProgressDisplayProps {
  progress: UserProgress | null;
  hasCompletedToday: boolean;
}

export default function ProgressDisplay({ progress, hasCompletedToday }: ProgressDisplayProps) {
  if (!progress) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-yellow-300">{progress.currentStreak}</div>
        <div className="text-white text-sm mt-2">Current Streak</div>
        <div className={`text-xs mt-1 ${hasCompletedToday ? 'text-green-300' : 'text-gray-300'}`}>
          {hasCompletedToday ? '✓ Completed today' : 'Today: Pending'}
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-purple-300">{progress.longestStreak}</div>
        <div className="text-white text-sm mt-2">Longest Streak</div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-blue-300">{progress.totalPuzzlesSolved}</div>
        <div className="text-white text-sm mt-2">Puzzles Solved</div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-pink-300">{progress.totalScore}</div>
        <div className="text-white text-sm mt-2">Total Score</div>
      </div>
    </div>
  );
}
