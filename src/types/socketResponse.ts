export interface SocketError {
  status: "error";
  message: string;
}

export type SocketResponse<TSuccess extends object> =
  ({ status: "ok" } & TSuccess) | SocketError;