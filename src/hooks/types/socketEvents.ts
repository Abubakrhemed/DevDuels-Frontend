import type { SocketResponse } from "./socket";
import type { Lobby, Player, PublicLobbySummary } from "./lobby";

export type LobbyCreateResponse = SocketResponse<{
  roomId: string;
  lobby: Lobby;
}>;

export type LobbyFetchResponse = SocketResponse<{
  lobbies: PublicLobbySummary[];
}>;

export interface ClientToServerEvents {
  "lobby:create": (
    playerId: string,
    callback: (response: LobbyCreateResponse) => void
  ) => void;
  "lobby:getPublic": (
    callback: (response: LobbyFetchResponse) => void
  ) => void;
}

export interface ServerToClientEvents {
  "lobby:playerJoined": (payload: { player: Player }) => void;
  "lobby:playerLeft": (payload: { username: string }) => void;
}
