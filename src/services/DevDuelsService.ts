import { socketRequest } from "./helpers/socketRequest";
import type {
  LobbyCreateResponse,
  LobbyFetchResponse,
  LobbyPrivacyChangeResponse,
  LobbyLeaveResponse
} from "../types/socketEvents";
import type { LobbyPrivacy } from "../types/Lobby";

export const devDuelsService = {
  createLobby(playerId: string) {
    return socketRequest<LobbyCreateResponse>("lobby:create", playerId);
  },

  getAllPublicLobbies() {
    return socketRequest<LobbyFetchResponse>("lobby:getPublic");
  },

  leaveLobby(roomId:string,playerid:string) {
    return socketRequest<LobbyLeaveResponse>("lobby:dissconnect",roomId,playerid)
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
};