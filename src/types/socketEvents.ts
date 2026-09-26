import type { SocketResponse } from "./socketResponse";
import type { Lobby, LobbyPrivacy, Player, PublicLobbySummary } from "./Lobby";
import type {
  SafeQuestion,
  GameStatePayload,
  GameOverPayload,
  GameEndPayload,
} from "./game";

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
  message: string;
}>;

export type JoinLobbyResponse = SocketResponse<{
  lobby: Lobby;
}>;

export type LobbyGetCurrentResponse = SocketResponse<{
  lobby: Lobby;
}>;

export type GameAckResponse = SocketResponse<Record<string, never>>;

export interface OpponentUpdate {
  userId: string;
  username: string;
  score: number;
  lives: number;
}

export interface ClientToServerEvents {
  "lobby:create": (
    playerId: string,
    callback: (response: LobbyCreateResponse) => void
  ) => void;
  "lobby:getPublic": (
    callback: (response: LobbyFetchResponse) => void
  ) => void;
  "lobby:getCurrent": (
    roomId: string,
    callback: (response: LobbyGetCurrentResponse) => void
  ) => void;
  "lobby:privacyChange": (
    roomId: string,
    playerId: string,
    privacyUpdate: LobbyPrivacy,
    callback: (response: LobbyPrivacyChangeResponse) => void
  ) => void;
  "lobby:join": (
    roomId: string,
    playerid: string,
    password: string,
    callback: (response: JoinLobbyResponse) => void
  ) => void;
  "lobby:dissconnect": (
    roomId: string,
    playerid: string,
    callback: (response: LobbyLeaveResponse) => void
  ) => void;
  "game:begin": (
    roomId: string,
    callback: (response: GameAckResponse) => void
  ) => void;
  "game:start": (
    roomId: string,
    playerid: string,
    callback?: (response: GameAckResponse) => void
  ) => void;
  "game:answerSubmited": (
    answer: string,
    playerid: string,
    roomId: string,
    callback?: (response: GameAckResponse) => void
  ) => void;
}

export interface ServerToClientEvents {
  "lobby:playerJoined": (payload: { player: Player }) => void;
  "lobby:playerLeft": (payload: { username: string }) => void;
  "lobby:publicListChanged": (payload: {
    lobbies: PublicLobbySummary[];
  }) => void;
  "game:started": () => void;
  "game:questionSent": (
    question: SafeQuestion,
    state?: GameStatePayload
  ) => void;
  "game:opponentUpdate": (payload: OpponentUpdate) => void;
  "game:over": (payload: GameOverPayload) => void;
  "game:end": (payload: GameEndPayload) => void;
  "game:returnToLobby": () => void;
  "game:error": (message: string) => void;
}