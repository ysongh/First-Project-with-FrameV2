export interface Game {
  id: string;
  name: string;
  players: number;
  status: 'waiting' | 'active' | 'finished';
  createdAt: string;
}

// API service to fetch and manage games
export const gameService = {
  // Get all available games
  getGames: async (): Promise<Game[]> => {
    try {
      const response = await fetch('/api/games', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  },
  
  // Get a specific game by ID
  getGame: async (id: string): Promise<Game | null> => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch game');
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching game ${id}:`, error);
      return null;
    }
  },
  
  // Create a new game
  createGame: async (name?: string): Promise<Game | null> => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating game:', error);
      return null;
    }
  }
};
