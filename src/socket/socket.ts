import { BASE_URI } from "../config/config";
import { io } from "socket.io-client";

export const socket = io(`${BASE_URI}`)