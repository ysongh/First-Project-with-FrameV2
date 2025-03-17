import { NextResponse } from 'next/server';

export interface Game {
  id: string;
  name: string;
  players: number;
  status: 'waiting' | 'active' | 'finished';
  createdAt: string;
}

// Simulated database of games
let games: Game[] = [
  { 
    id: '1', 
    name: 'Fun Bingo Night', 
    players: 3, 
    status: 'waiting',
    createdAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    name: 'Test Game', 
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
];

// GET handler to retrieve all games
export async function GET() {
  return NextResponse.json(games);
}

// POST handler to create a new game
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate a new unique ID (in a real app, this would be done by the database)
    const newId = (Math.max(...games.map(game => parseInt(game.id)), 0) + 1).toString();
    
    const newGame: Game = {
      id: newId,
      name: data.name || `Bingo Game #${newId}`,
      players: 1, // Start with the creator
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    
    // Add to our games array
    games = [...games, newGame];
    
    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' + error }, { status: 400 });
  }
}
