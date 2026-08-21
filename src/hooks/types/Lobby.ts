export interface Player {
  userId: string;
  username: string;
  score: number;
  lives: number;
}

export interface Lobby {
  roomId: string;
  players: [string, Player][];
  privacy: "PUBLIC" | "PRIVATE";
  maxPlayers: number;
  minPlayers: number;
  password?: string;
  inProgress: boolean;
}

export interface PublicLobbySummary {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
}