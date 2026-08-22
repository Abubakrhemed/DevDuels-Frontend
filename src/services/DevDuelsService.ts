import { socketRequest } from "./helpers/socketRequest";
import type {
  LobbyCreateResponse,
  LobbyFetchResponse,
  LobbyPrivacyChangeResponse,
} from "../types/socketEvents";
import type { LobbyPrivacy } from "../types/lobby";

export const devDuelsService = {
  createLobby(playerId: string) {
    return socketRequest<LobbyCreateResponse>("lobby:create", playerId);
  },

  getAllPublicLobbies() {
    return socketRequest<LobbyFetchResponse>("lobby:getPublic");
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