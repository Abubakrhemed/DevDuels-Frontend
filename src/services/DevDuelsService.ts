import { socketRequest } from "./helpers/socketRequest";
import type {
  LobbyCreateResponse,
  LobbyFetchResponse,
} from "../hooks/types/socketEvents";

export const devDuelsService = {
  createLobby(playerId: string) {
    return socketRequest<LobbyCreateResponse>("lobby:create", playerId);
  },

  getAllPublicLobbies() {
    return socketRequest<LobbyFetchResponse>("lobby:getPublic");
  },
};