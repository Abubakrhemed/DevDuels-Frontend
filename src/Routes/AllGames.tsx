import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { CreateGameButton, JoinLobbyButton } from "../components/components";
import { devDuelsService } from "../services/DevDuelsService";
import { socket } from "../socket/socket";
import type { PublicLobbySummary } from "../types/Lobby";

export function AllGames() {
  const [lobbies, setLobbies] = useState<PublicLobbySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");

  function updatePassword(event: ChangeEvent<HTMLInputElement>) {
    setPasswordInput(event.target.value);
  }

  function updateRoomId(event: ChangeEvent<HTMLInputElement>) {
    setRoomIdInput(event.target.value);
  }

  useEffect(() => {
    async function getLobbies() {
      try {
        const response = await devDuelsService.getAllPublicLobbies();
        if (response.status === "ok") {
          setLobbies(response.lobbies);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getLobbies();
  }, []);

  useEffect(() => {
    function handlePublicListChanged(payload: {
      lobbies: PublicLobbySummary[];
    }) {
      setLobbies(payload.lobbies);
    }

    socket.on("lobby:publicListChanged", handlePublicListChanged);

    return () => {
      socket.off("lobby:publicListChanged", handlePublicListChanged);
    };
  }, []);

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
        <CreateGameButton />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <span className="font-display text-xs uppercase tracking-wider text-muted sm:whitespace-nowrap">
          join private game
        </span>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="room id"
            value={roomIdInput}
            onChange={updateRoomId}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent"
          />
          <input
            type="password"
            placeholder="password"
            value={passwordInput}
            onChange={updatePassword}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent sm:w-40"
          />
          <JoinLobbyButton roomId={roomIdInput} password={passwordInput} />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 rounded-lg border border-border bg-surface p-10 text-center">
          <p className="font-display text-sm text-muted">
            loading lobbies...
          </p>
        </div>
      ) : lobbies.length === 0 ? (
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
          {lobbies.map((lobby) => (
            <div
              key={lobby.roomId}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface p-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-medium text-text">
                    room {lobby.roomId}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-display text-xs text-muted">
                    {lobby.playerCount}/{lobby.maxPlayers}
                  </span>
                </div>
              </div>
              <JoinLobbyButton roomId={lobby.roomId} variant="primary" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}