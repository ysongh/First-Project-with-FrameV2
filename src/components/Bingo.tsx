"use client";

import { useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";

import { createStore } from "mipd";

import { BingoCard } from "./bingo/BingoCard";
import { NumberDrawer } from "./bingo/NumberDrawer";

export default function Bingo(
  { title }: { title?: string } = { title: "Bingo" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lastDrawnNumber, setLastDrawnNumber] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [hasBingo, setHasBingo] = useState<boolean>(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const startNewGame = () => {
    setDrawnNumbers([]);
    setLastDrawnNumber(null);
    setGameActive(true);
    setHasBingo(false);
  };

  const drawNumber = () => {
    if (!gameActive || drawnNumbers.length >= 75) return;
    
    // Generate all possible numbers (1-75)
    const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    
    // Filter out already drawn numbers
    const availableNumbers = allNumbers.filter(num => !drawnNumbers.includes(num));
    
    // Draw a random number from available numbers
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newDrawnNumber = availableNumbers[randomIndex];
    
    setLastDrawnNumber(newDrawnNumber);
    setDrawnNumbers(prev => [...prev, newDrawnNumber]);
  };

  const declareBingo = () => {
    setHasBingo(true);
    setGameActive(false);
  };

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mt-10 mb-4">Bingo {title}</h1>
        
        <div className="">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <NumberDrawer 
              lastDrawnNumber={lastDrawnNumber} 
              drawnNumbers={drawnNumbers}
              drawNumber={drawNumber}
              gameActive={gameActive}
              startNewGame={startNewGame}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <BingoCard 
              drawnNumbers={drawnNumbers} 
              gameActive={gameActive}
              declareBingo={declareBingo}
              hasBingo={hasBingo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
