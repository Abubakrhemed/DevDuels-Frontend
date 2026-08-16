interface LobbyPlayer {
  userId: string;
  username: string;
  isHost: boolean;
}

interface LobbyMessage {
  id: string;
  text: string;
}

const mockPlayers: LobbyPlayer[] = [
  { userId: "1", username: "player_01", isHost: true },
  { userId: "2", username: "player_02", isHost: false },
];

const mockMessages: LobbyMessage[] = [
  { id: "m1", text: "player_01 created the lobby" },
  { id: "m2", text: "player_02 joined the lobby" },
];

export function Lobby() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">
            lobby
          </h1>
          <p className="mt-1 font-display text-xs text-muted">
            room 8f3a1c · private
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-md border border-border bg-surface px-4 py-2 font-display text-xs text-muted">
            password <span className="text-text">4kd9</span>
          </div>
          <button className="rounded-md border border-border px-4 py-2 font-display text-xs text-text transition-colors hover:border-accent hover:text-accent">
            copy invite
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xs uppercase tracking-wider text-muted">
            players 2/4
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {mockPlayers.map((player) => (
              <div
                key={player.userId}
                className="flex items-center justify-between rounded-md border border-border bg-bg px-4 py-3"
              >
                <span className="font-display text-sm text-text">
                  {player.username}
                </span>
                {player.isHost && (
                  <span className="rounded-full border border-accent px-2 py-0.5 font-display text-xs text-accent">
                    host
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button className="rounded-md border border-border px-4 py-2 font-display text-sm text-muted transition-colors hover:border-danger hover:text-danger">
              leave lobby
            </button>
            <button className="rounded-md bg-accent px-6 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90">
              start game
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xs uppercase tracking-wider text-muted">
            activity
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {mockMessages.map((message) => (
              <p key={message.id} className="font-display text-xs text-muted">
                {message.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
