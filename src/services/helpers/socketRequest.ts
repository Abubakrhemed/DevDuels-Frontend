import { socket } from "../../socket/socket";

export function socketRequest<TResponse>(
  event: string,
  ...args: unknown[]
): Promise<TResponse> {
  return socket.timeout(8000).emitWithAck(event, ...args);
}
