import { socketRequest } from "./helpers/socketRequest";
import type {
  LobbyCreateResponse,
  LobbyFetchResponse,
  LobbyPrivacyChangeResponse,
  LobbyLeaveResponse,
  JoinLobbyResponse,
  LobbyGetCurrentResponse,
  GameAckResponse,
} from "../types/socketEvents";
import type { LobbyPrivacy } from "../types/Lobby";

export const devDuelsService = {
  createLobby(playerId: string) {
    return socketRequest<LobbyCreateResponse>("lobby:create", playerId);
  },

  getAllPublicLobbies() {
    return socketRequest<LobbyFetchResponse>("lobby:getPublic");
  },

  getCurrentLobby(roomId: string) {
    return socketRequest<LobbyGetCurrentResponse>("lobby:getCurrent", roomId);
  },

  leaveLobby(roomId: string, playerid: string) {
    return socketRequest<LobbyLeaveResponse>(
      "lobby:dissconnect",
      roomId,
      playerid
    );
  },

  requestJoin(roomId: string, playerid: string, password: string) {
    return socketRequest<JoinLobbyResponse>(
      "lobby:join",
      roomId,
      playerid,
      password
    );
  },

  updateLobbyPrivacy(
    roomId: string,
    playerId: string,
    privacyUpdate: LobbyPrivacy
  ) {
    return socketRequest<LobbyPrivacyChangeResponse>(
      "lobby:privacyChange",
      roomId,
      playerId,
      privacyUpdate
    );
  },

  beginGame(roomId: string) {
    return socketRequest<GameAckResponse>("game:begin", roomId);
  },
};