import { io, Socket } from "socket.io-client";
import { BASE_URI } from "../config/config";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socketEvents";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io(BASE_URI);