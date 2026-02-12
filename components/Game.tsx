'use client';

import { useTokenAuth } from '@/lib/contexts/TokenAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WordScramble from './puzzles/WordScramble';
import Arithmetic from './puzzles/Arithmetic';

export default function Game() {
  const { username, logout } = useTokenAuth();
  const router = useRouter();
  const [puzzleType, setPuzzleType] = useState<'word-scramble' | 'arithmetic'>('word-scramble');
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const loadStreak = () => {
      const stored = localStorage.getItem(`streak_${username}`);
      setStreak(stored ? parseInt(stored) : 0);
    };
    loadStreak();
  }, [username]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSolve = () => {
    setSolved(true);
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem(`streak_${username}`, newStreak.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Daily Puzzle</h1>
            <p className="text-purple-200">Welcome, {username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-white/20">
          <div className="text-white text-center">
            <p className="text-sm text-purple-200 mb-1">Current Streak</p>
            <p className="text-4xl font-bold">{streak}</p>
          </div>
        </div>

        {/* Puzzle Type Selection */}
        {!solved && (
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setPuzzleType('word-scramble')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
                puzzleType === 'word-scramble'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Word Scramble
            </button>
            <button
              onClick={() => setPuzzleType('arithmetic')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition ${
                puzzleType === 'arithmetic'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Arithmetic
            </button>
          </div>
        )}

        {/* Puzzle Component */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          {solved ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Puzzle Solved!</h2>
              <p className="text-gray-600 mb-6">Great job! Come back tomorrow for the next puzzle.</p>
              <button
                onClick={() => {
                  setSolved(false);
                  setPuzzleType('word-scramble');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Solve Another
              </button>
            </div>
          ) : puzzleType === 'word-scramble' ? (
            <WordScramble onSolve={handleSolve} />
          ) : (
            <Arithmetic onSolve={handleSolve} />
          )}
        </div>
      </div>
    </div>
  );
}
