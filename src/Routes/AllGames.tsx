interface PublicLobby {
  roomId: string;
  hostUsername: string;
  playerCount: number;
  maxPlayers: number;
}

const mockLobbies: PublicLobby[] = [
  { roomId: "8f3a1c", hostUsername: "player_01", playerCount: 2, maxPlayers: 4 },
  { roomId: "b92e40", hostUsername: "codeCrusher", playerCount: 1, maxPlayers: 4 },
  { roomId: "1d77aa", hostUsername: "nullPointerX", playerCount: 3, maxPlayers: 4 },
  { roomId: "5e0c9f", hostUsername: "stackOverflowed", playerCount: 1, maxPlayers: 4 },
  { roomId: "2a44b7", hostUsername: "segfault_sam", playerCount: 4, maxPlayers: 4 },
  { roomId: "9c1123", hostUsername: "player_09", playerCount: 2, maxPlayers: 4 },
];

export function AllGames() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">
            public lobbies
          </h1>
          <p className="mt-1 text-sm text-muted">
            jump into an open game or start your own
          </p>
        </div>
        <button className="rounded-md bg-accent px-5 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90">
          create game
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <span className="font-display text-xs uppercase tracking-wider text-muted sm:whitespace-nowrap">
          join private game
        </span>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="room id"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent"
          />
          <input
            type="password"
            placeholder="password"
            className="w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent sm:w-40"
          />
          <button className="shrink-0 rounded-md border border-border px-5 py-2 font-display text-sm text-text transition-colors hover:border-accent hover:text-accent">
            join
          </button>
        </div>
      </div>

      {mockLobbies.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-surface p-10 text-center">
          <p className="font-display text-sm text-muted">
            no public lobbies right now
          </p>
          <p className="mt-1 text-sm text-muted">
            create one to get a duel started
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {mockLobbies.map((lobby) => (
            <div
              key={lobby.roomId}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface p-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-medium text-text">
                    {lobby.hostUsername}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-display text-xs text-muted">
                    {lobby.playerCount}/{lobby.maxPlayers}
                  </span>
                </div>
                <p className="mt-2 font-display text-xs text-muted">
                  room {lobby.roomId}
                </p>
              </div>
              <button className="mt-5 rounded-md bg-accent px-4 py-2 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90">
                join game
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
