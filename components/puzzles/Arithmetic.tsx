'use client';

import { useState } from 'react';

interface ArithmeticProps {
  onSolve: () => void;
}

function generateProblem(): { num1: number; num2: number; operator: string; result: number } {
  const num1 = Math.floor(Math.random() * 50) + 1;
  const num2 = Math.floor(Math.random() * 50) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let result = 0;
  switch (operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
  }

  return { num1, num2, operator, result };
}

export default function Arithmetic({ onSolve }: ArithmeticProps) {
  const [problem] = useState(() => generateProblem());
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const isRight = parseInt(answer) === problem.result;
    setIsCorrect(isRight);
    setSubmitted(true);
    if (isRight) {
      setTimeout(onSolve, 1000);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Arithmetic Challenge</h2>
      <p className="text-gray-600 mb-6">Solve this problem:</p>
      <div className="text-4xl font-bold text-green-600 mb-8">
        {problem.num1} {problem.operator} {problem.num2} = ?
      </div>
      <div className="space-y-4">
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={submitted && isCorrect}
        />
        <button
          onClick={handleSubmit}
          disabled={submitted && isCorrect}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          {submitted ? (isCorrect ? '✓ Correct!' : 'Try Again') : 'Submit'}
        </button>
      </div>
      {submitted && !isCorrect && (
        <p className="mt-4 text-red-600 font-bold">The answer is: {problem.result}</p>
      )}
    </div>
  );
}
