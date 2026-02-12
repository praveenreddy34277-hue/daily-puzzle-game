'use client';

import { useState, useMemo } from 'react';

interface WordScrambleProps {
  onSolve: () => void;
}

const words = ['JAVASCRIPT', 'TYPESCRIPT', 'COMPONENT', 'DATABASE', 'ALGORITHM', 'INTERFACE'];

function scrambleWord(word: string, seed: number): string {
  // Use seed to generate consistent scramble
  let random = seed;
  const chars = word.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    random = (random * 9301 + 49297) % 233280;
    const j = (random / 233280) * (i + 1) | 0;
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export default function WordScramble({ onSolve }: WordScrambleProps) {
  // Use useMemo to keep the same word and scramble throughout the session
  const { word, scrambled } = useMemo(() => {
    const seed = Math.floor(Math.random() * 233280);
    const selectedWord = words[seed % words.length];
    const scrambledWord = scrambleWord(selectedWord, seed);
    return { word: selectedWord, scrambled: scrambledWord };
  }, []);

  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const isRight = answer.toUpperCase() === word;
    setIsCorrect(isRight);
    setSubmitted(true);
    if (isRight) {
      setTimeout(onSolve, 1000);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Word Scramble</h2>
      <p className="text-gray-600 mb-6">Unscramble this word:</p>
      <div className="text-4xl font-bold text-purple-600 mb-8 tracking-widest">
        {scrambled}
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center uppercase"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={submitted && isCorrect}
        />
        <button
          onClick={handleSubmit}
          disabled={submitted && isCorrect}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          {submitted ? (isCorrect ? '✓ Correct!' : 'Try Again') : 'Submit'}
        </button>
      </div>
      {submitted && !isCorrect && (
        <p className="mt-4 text-red-600 font-bold">The answer is: {word}</p>
      )}
    </div>
  );
}
