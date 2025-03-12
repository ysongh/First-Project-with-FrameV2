"use client";

import React, { useState, useEffect } from 'react';

interface BingoCardProps {
  drawnNumbers: number[];
  gameActive: boolean;
  declareBingo: () => void;
  hasBingo: boolean;
}

export const BingoCard: React.FC<BingoCardProps> = ({ 
  drawnNumbers, 
  gameActive, 
  declareBingo,
  hasBingo
}) => {
  // Bingo card structure with 5x5 grid (B:1-15, I:16-30, N:31-45, G:46-60, O:61-75)
  // The middle cell (index 12) is a free space
  const [cardNumbers, setCardNumbers] = useState<number[][]>([]);
  
  // Initialize bingo card with random numbers
  useEffect(() => {
    generateNewCard();
  }, []);

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

  const isNumberMarked = (num: number): boolean => {
    return drawnNumbers.includes(num);
  };

  // Function to check if middle cell (free space)
  const isFreeSpace = (col: number, row: number): boolean => {
    return col === 2 && row === 2;
  };

  // Check if the user has a bingo
  const checkForBingo = (): boolean => {
    if (!gameActive) return false;
    
    // Check rows
    for (let row = 0; row < 5; row++) {
      let rowComplete = true;
      for (let col = 0; col < 5; col++) {
        if (!isFreeSpace(col, row) && !isNumberMarked(cardNumbers[col][row])) {
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
        if (!isFreeSpace(col, row) && !isNumberMarked(cardNumbers[col][row])) {
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
      if (!isFreeSpace(i, i) && !isNumberMarked(cardNumbers[i][i])) {
        diag1Complete = false;
      }
      if (!isFreeSpace(4-i, i) && !isNumberMarked(cardNumbers[4-i][i])) {
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
          <>
            {Array.from({ length: 5 }).map((_, col) => {
              const isFree = isFreeSpace(col, row);
              const number = isFree ? 'FREE' : cardNumbers[col]?.[row];
              const isMarked = isFree || (number && isNumberMarked(number));
              
              return (
                <div 
                  key={`cell-${col}-${row}`}
                  className={`aspect-square flex items-center justify-center text-lg font-medium border ${
                    isMarked 
                      ? 'bg-red-500 text-white border-red-600' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {number}
                </div>
              );
            })}
          </>
        ))}
      </div>
      
      <button
        onClick={() => {
          if (checkForBingo()) {
            declareBingo();
          }
        }}
        disabled={!gameActive || hasBingo}
        className={`px-4 py-2 rounded-md font-bold ${
          gameActive && !hasBingo
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Call BINGO!
      </button>
      
      {hasBingo && (
        <div className="mt-4 text-xl font-bold text-green-600">
          BINGO! You won!
        </div>
      )}
    </div>
  );
};
