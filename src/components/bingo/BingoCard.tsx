"use client";

import React, { useState, useEffect } from 'react';

interface BingoCardProps {
  drawnNumbers: number[];
  gameActive: boolean;
  verifyBingo: (markedPositions: [number, number][]) => void;
  gameResult: 'none' | 'win' | 'invalid';
}

export const BingoCard: React.FC<BingoCardProps> = ({ 
  drawnNumbers, 
  gameActive, 
  verifyBingo,
  gameResult
}) => {
  // Bingo card structure with 5x5 grid (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75)
  // The middle cell (index 12) is a free space
  const [cardNumbers, setCardNumbers] = useState<number[][]>([]);
  const [markedPositions, setMarkedPositions] = useState<[number, number][]>([]);
  
  // Initialize bingo card with random numbers
  useEffect(() => {
    generateNewCard();
    // Mark the free space by default
    setMarkedPositions([[2, 2]]);
  }, []);

  // Reset marked positions when starting a new game (except free space)
  useEffect(() => {
    if (gameActive && gameResult === 'none' && drawnNumbers.length === 0) {
      generateNewCard();
      setMarkedPositions([[2, 2]]);
    }
  }, [gameActive, gameResult, drawnNumbers]);

  const generateNewCard = () => {
    const newCard: number[][] = [];
    
    // Generate 5 columns (B, I, N, G, O)
    for (let col = 0; col < 5; col++) {
      const columnNumbers: number[] = [];
      const min = col * 15 + 1;
      const max = min + 14;
      
      // Generate 5 unique random numbers for each column
      while (columnNumbers.length < 5) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!columnNumbers.includes(num)) {
          columnNumbers.push(num);
        }
      }
      
      newCard.push(columnNumbers);
    }
    
    setCardNumbers(newCard);
  };

  // Function to check if middle cell (free space)
  const isFreeSpace = (col: number, row: number): boolean => {
    return col === 2 && row === 2;
  };

  // Function to check if a position is marked
  const isMarked = (col: number, row: number): boolean => {
    return markedPositions.some(([c, r]) => c === col && r === row);
  };

  // Toggle marking a position
  const toggleMark = (col: number, row: number) => {
    if (!gameActive || gameResult === 'win') return;
    
    // Don't allow unmarking the free space
    if (isFreeSpace(col, row)) return;
    
    if (isMarked(col, row)) {
      // Unmark the position
      setMarkedPositions(prev => prev.filter(([c, r]) => !(c === col && r === row)));
    } else {
      // Mark the position
      setMarkedPositions(prev => [...prev, [col, row]]);
    }
  };

  // Check if a row, column, or diagonal is completely marked
  const hasCompleteLine = (): boolean => {
    // Check rows
    for (let row = 0; row < 5; row++) {
      let rowComplete = true;
      for (let col = 0; col < 5; col++) {
        if (!isMarked(col, row)) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) return true;
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      let colComplete = true;
      for (let row = 0; row < 5; row++) {
        if (!isMarked(col, row)) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) return true;
    }
    
    // Check diagonals
    let diag1Complete = true;
    let diag2Complete = true;
    
    for (let i = 0; i < 5; i++) {
      if (!isMarked(i, i)) {
        diag1Complete = false;
      }
      if (!isMarked(4-i, i)) {
        diag2Complete = false;
      }
    }
    
    return diag1Complete || diag2Complete;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Your Bingo Card</h2>
      
      <div className="mb-6 grid grid-cols-5 gap-1 w-full max-w-md">
        {/* Header row with B-I-N-G-O letters */}
        {['B', 'I', 'N', 'G', 'O'].map((letter, idx) => (
          <div 
            key={`header-${idx}`} 
            className="bg-blue-600 text-white text-center py-2 font-bold text-lg"
          >
            {letter}
          </div>
        ))}
        
        {/* Bingo card numbers */}
        {Array.from({ length: 5 }).map((_, row) => (
          <React.Fragment key={`row-${row}`}>
            {Array.from({ length: 5 }).map((_, col) => {
              const isFree = isFreeSpace(col, row);
              const marked = isMarked(col, row);
              const number = isFree ? null : cardNumbers[col]?.[row];
              const isDrawn = number ? drawnNumbers.includes(number) : false;
              
              return (
                <div 
                  id={`bingo-cell-${col}-${row}`}
                  key={`cell-${col}-${row}`}
                  data-number={number}
                  onClick={() => toggleMark(col, row)}
                  className={`aspect-square flex items-center justify-center text-lg font-medium border ${
                    marked 
                      ? 'bg-red-500 text-white border-red-600' 
                      : isDrawn
                        ? 'bg-yellow-100 border-yellow-300'
                        : 'bg-white border-gray-300'
                  } ${gameActive && !isFree ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                >
                  {isFree ? 'FREE' : number}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm mb-2">Click on numbers to mark them when you find matches</p>
        <p className="text-sm mb-2">Numbers that have been drawn are highlighted in yellow</p>
      </div>
      
      <button
        onClick={() => {
          if (hasCompleteLine()) {
            verifyBingo(markedPositions);
          }
        }}
        disabled={!gameActive || !hasCompleteLine()}
        className={`px-4 py-2 rounded-md font-bold ${
          gameActive && hasCompleteLine()
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Call BINGO!
      </button>
      
      {gameResult === 'win' && (
        <div className="mt-4 text-xl font-bold text-green-600">
          BINGO! You won!
        </div>
      )}
      
      {gameResult === 'invalid' && (
        <div className="mt-4 text-xl font-bold text-red-600">
          Invalid BINGO! Some marked numbers haven&#39;t been drawn.
        </div>
      )}
    </div>
  );
};