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
import axios from "axios";
import { BASE_URI } from "../config/config";

export const devDuelsService = {
  createLobby(playerId: string) {
    return socketRequest<LobbyCreateResponse>("lobby:create", playerId);
  },

  async requestPasswordReset(username: string, email: string) {
    const response = await axios.post(`${BASE_URI}/api/user/passwordReset`, {
      username,
      email,
    });
    return response.data;
  },

  async passwordReset(token: string, password: string) {
    const response = await axios.put(`${BASE_URI}/api/user/passwordReset`, {
      token,
      password,
    });
    return response.data;
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
      playerid,
    );
  },

  requestJoin(roomId: string, playerid: string, password: string) {
    return socketRequest<JoinLobbyResponse>(
      "lobby:join",
      roomId,
      playerid,
      password,
    );
  },

  updateLobbyPrivacy(
    roomId: string,
    playerId: string,
    privacyUpdate: LobbyPrivacy,
  ) {
    return socketRequest<LobbyPrivacyChangeResponse>(
      "lobby:privacyChange",
      roomId,
      playerId,
      privacyUpdate,
    );
  },

  beginGame(roomId: string) {
    return socketRequest<GameAckResponse>("game:begin", roomId);
  },
};
