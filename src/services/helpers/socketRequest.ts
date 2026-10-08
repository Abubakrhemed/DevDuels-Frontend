import { socket } from "../../socket/socket";
import type { ClientToServerEvents } from "../../types/socketEvents";

type UntypedAckSocket = {
  timeout(ms: number): {
    emitWithAck(event: string, ...args: unknown[]): Promise<unknown>;
  };
};

export function socketRequest<TResponse>(
  event: keyof ClientToServerEvents,
  ...args: unknown[]
): Promise<TResponse> {
  const untyped = socket as unknown as UntypedAckSocket;
  return untyped.timeout(8000).emitWithAck(event, ...args) as Promise<TResponse>;
}