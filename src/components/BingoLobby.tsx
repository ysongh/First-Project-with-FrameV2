"use client";

import { useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { createStore } from "mipd";

interface Game {
  id: string;
  name: string;
  players: number;
  status: 'waiting' | 'active' | 'finished';
  createdAt: string;
}

export default function BingoLobby(
  { title }: { title?: string } = { title: "Bingo Lobby" }
) {
  const router = useRouter();

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [games] = useState<Game[]>([
    { 
      id: '1', 
      name: 'Fun Bingo Night', 
      players: 3, 
      status: 'waiting',
      createdAt: new Date().toISOString() 
    },
    { 
      id: '2', 
      name: 'Quick Game', 
      players: 5, 
      status: 'active',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString() 
    },
    { 
      id: '3', 
      name: 'Championship Round', 
      players: 12, 
      status: 'active',
      createdAt: new Date(Date.now() - 30 * 60000).toISOString() 
    }
  ]);
  const [context, setContext] = useState<Context.FrameContext>();

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

  const createNewGame = () => {
    // In a real app, we would make an API call to create a new game
    const gameId = Math.floor(Math.random() * 10000).toString();
    
    // Navigate to the newly created game
    router.push(`/game/${gameId}`);
  };

  const getStatusBadge = (status: 'waiting' | 'active' | 'finished') => {
    switch (status) {
      case 'waiting':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Waiting</span>;
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Active</span>;
      case 'finished':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">Finished</span>;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[500px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mt-10 mb-4">Bingo Lobby{title}</h1>
        <Link 
          href="/bingo" 
          className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors text-center"
        >
          Start New Game
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Available Games</h2>
            <button 
              onClick={createNewGame}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold"
            >
              Create New Game
            </button>
          </div>
          
          {games.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Game Name</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Players</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {games.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">{game.name}</td>
                      <td className="py-4 px-4">{game.players}</td>
                      <td className="py-4 px-4">{getStatusBadge(game.status)}</td>
                      <td className="py-4 px-4">{formatTime(game.createdAt)}</td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/game/${game.id}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                        >
                          Join
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No games available. Create a new game to get started!
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="font-bold mb-2">How to Play:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Join an existing game or create a new one</li>
              <li>Wait for numbers to be called</li>
              <li>Click on matching numbers on your card</li>
              <li>Call &#34;BINGO&#34; when you get 5 in a row</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
