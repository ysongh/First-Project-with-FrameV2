"use client";

import React from 'react';

interface NumberDrawerProps {
  lastDrawnNumber: number | null;
  drawnNumbers: number[];
  drawNumber: () => void;
  gameActive: boolean;
  startNewGame: () => void;
}

export const NumberDrawer: React.FC<NumberDrawerProps> = ({
  lastDrawnNumber,
  drawnNumbers,
  drawNumber,
  gameActive,
  startNewGame
}) => {
  // Helper function to get letter for number
  const getLetterForNumber = (num: number): string => {
    if (num <= 15) return 'B';
    if (num <= 30) return 'I';
    if (num <= 45) return 'N';
    if (num <= 60) return 'G';
    return 'O';
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Number Drawer</h2>
      
      {lastDrawnNumber ? (
        <div className="mb-6 flex flex-col items-center">
          <div className="text-lg mb-1">Last number drawn:</div>
          <div className="bg-blue-600 text-white text-4xl font-bold p-6 rounded-full w-24 h-24 flex items-center justify-center">
            {getLetterForNumber(lastDrawnNumber)}-{lastDrawnNumber}
          </div>
        </div>
      ) : (
        <div className="mb-6 h-24 flex items-center justify-center">
          <span className="text-gray-500 italic">
            {gameActive ? "Click 'Draw Number' to start" : "Click 'New Game' to begin"}
          </span>
        </div>
      )}
      
      <div className="mb-6 flex space-x-4">
        <button
          onClick={drawNumber}
          disabled={!gameActive || drawnNumbers.length >= 75}
          className={`px-4 py-2 rounded-md font-bold ${
            gameActive && drawnNumbers.length < 75
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Draw Number
        </button>
        
        <button
          onClick={startNewGame}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold"
        >
          New Game
        </button>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Drawn Numbers: {drawnNumbers.length}/75</h3>
        <div className="grid grid-cols-5 gap-1 md:gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded">
          {drawnNumbers.length > 0 ? (
            drawnNumbers.map((num, idx) => (
              <div 
                key={idx} 
                className="bg-gray-100 text-center py-1 px-1 text-sm rounded"
              >
                {getLetterForNumber(num)}-{num}
              </div>
            ))
          ) : (
            <div className="col-span-5 text-gray-500 italic text-center py-2">
              No numbers drawn yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
