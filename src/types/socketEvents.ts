import type { SocketResponse } from "./socketResponse";
import type { Lobby, LobbyPrivacy, Player, PublicLobbySummary } from "./Lobby";

export type LobbyCreateResponse = SocketResponse<{
  roomId: string;
  lobby: Lobby;
}>;

export type LobbyFetchResponse = SocketResponse<{
  lobbies: PublicLobbySummary[];
}>;

export type LobbyPrivacyChangeResponse = SocketResponse<{
  lobby: Lobby;
}>;

export type LobbyLeaveResponse = SocketResponse<{
  status: string;
  message: string;
}>

export interface ClientToServerEvents {
  "lobby:create": (
    playerId: string,
    callback: (response: LobbyCreateResponse) => void
  ) => void;
  "lobby:getPublic": (
    callback: (response: LobbyFetchResponse) => void
  ) => void;
  "lobby:privacyChange": (
    roomId: string,
    playerId: string,
    privacyUpdate: LobbyPrivacy,
    callback: (response: LobbyPrivacyChangeResponse) => void
  ) => void;
}

export interface ServerToClientEvents {
  "lobby:playerJoined": (payload: { player: Player }) => void;
  "lobby:playerLeft": (payload: { username: string }) => void;
  "lobby:publicListChanged": (payload: {
    lobbies: PublicLobbySummary[];
  }) => void;
}