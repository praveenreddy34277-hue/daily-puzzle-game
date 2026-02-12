/**
 * Puzzle Display Component
 * Renders puzzle and handles user input
 */

'use client';

import React, { useState } from 'react';
import { BasePuzzle } from '@/lib/types';

interface PuzzleDisplayProps {
  puzzle: BasePuzzle;
  onSubmit: (answer: unknown) => void;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  feedback: string;
  attempts: number;
  hasCompletedToday: boolean;
}

export default function PuzzleDisplay({
  puzzle,
  onSubmit,
  isSubmitted,
  isCorrect,
  feedback,
  attempts,
  hasCompletedToday,
}: PuzzleDisplayProps) {
  const [userInput, setUserInput] = useState<string>('');

  const handleSubmit = () => {
    const answer = parseFloat(userInput) || userInput;
    onSubmit(answer);
    // Clear input for next attempt
    setUserInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitted && !hasCompletedToday) {
      handleSubmit();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white text-lg font-semibold mb-2">{puzzle.metadata.title}</h2>
        <div className="bg-white bg-opacity-5 rounded p-4 mb-4 min-h-64 flex items-center justify-center">
          {/* Dynamic puzzle rendering based on type */}
          <div className="text-white text-center">
            {typeof puzzle === 'object' && (puzzle as any).num1 !== undefined ? (
              // Arithmetic puzzle
              <div className="text-6xl font-bold">
                {(puzzle as any).num1} {(puzzle as any).operator} {(puzzle as any).num2} = ?
              </div>
            ) : typeof puzzle === 'object' && (puzzle as any).scrambledWord !== undefined ? (
              // Word scramble puzzle
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-4 tracking-widest">
                  {(puzzle as any).scrambledWord}
                </div>
                <p className="text-lg text-gray-200 mb-2">Hint: {(puzzle as any).hint}</p>
                <p className="text-sm text-gray-300">({(puzzle as any).originalWord.length} letters)</p>
              </div>
            ) : typeof puzzle === 'object' && (puzzle as any).pattern !== undefined ? (
              // Pattern puzzle
              <div>
                <div className="text-2xl font-bold mb-4">What comes next?</div>
                <div className="flex justify-center gap-4">
                  {(puzzle as any).pattern.map((num: number, idx: number) => (
                    <div
                      key={idx}
                      className="w-16 h-16 flex items-center justify-center bg-indigo-500 rounded-lg text-2xl font-bold text-white"
                    >
                      {num}
                    </div>
                  ))}
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded-lg text-2xl font-bold text-white border-2 border-dashed border-gray-400">
                    ?
                  </div>
                </div>
              </div>
            ) : (
              <div>{puzzle.metadata.description}</div>
            )}
          </div>
        </div>
      </div>

      {!hasCompletedToday && (
        <div className="mb-6">
          <label className="block text-white mb-2 font-semibold">Your Answer</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer..."
              disabled={false}
              className="flex-1 px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-100 disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
            >
              {isSubmitted && isCorrect ? 'Correct!' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-500 bg-opacity-20 border border-green-400' : 'bg-red-500 bg-opacity-20 border border-red-400'}`}>
          <p className={`font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-white mt-2">{feedback}</p>
          {!isCorrect && (
            <p className="text-gray-200 text-sm mt-2">Attempts: {attempts}</p>
          )}
        </div>
      )}

      {hasCompletedToday && (
        <div className="p-4 rounded-lg bg-blue-500 bg-opacity-20 border border-blue-400">
          <p className="text-blue-300 font-bold">You've completed today's puzzle!</p>
          <p className="text-white mt-2">Come back tomorrow for a new challenge.</p>
        </div>
      )}

      <div className="bg-white bg-opacity-5 rounded p-4">
        <h3 className="text-white font-semibold mb-2">Rules:</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          {puzzle.rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span>•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
