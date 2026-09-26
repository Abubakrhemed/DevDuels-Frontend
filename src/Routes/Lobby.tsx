import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChangeLobbyPrivacy, LeaveLobbyButton } from "../components/components";
import { devDuelsService } from "../services/DevDuelsService";
import { socket } from "../socket/socket";
import { useAuth } from "../hooks/useAuth";
import { usePopup } from "../hooks/Usepopup";
import type { Lobby as LobbyType, Player } from "../types/Lobby";

interface LobbyMessage {
  id: string;
  text: string;
}

function getStoredLobby(): LobbyType | null {
  const stored = localStorage.getItem("activeLobby");
  return stored ? (JSON.parse(stored) as LobbyType) : null;
}

export function Lobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showPopup } = usePopup();
  const [lobby, setLobby] = useState<LobbyType | null>(() => getStoredLobby());
  const [messages, setMessages] = useState<LobbyMessage[]>([]);
  const [starting, setStarting] = useState(false);

  function handleLobbyUpdate(updated: LobbyType) {
    setLobby(updated);
    localStorage.setItem("activeLobby", JSON.stringify(updated));
  }

  useEffect(() => {
    const cached = getStoredLobby();
    if (!cached) {
      navigate("/play");
      return;
    }

    async function refreshLobby() {
      try {
        const response = await devDuelsService.getCurrentLobby(cached!.roomId);

        if (response.status === "ok") {
          const isMember = response.lobby.players.some(
            ([playerId]) => playerId === user?._id
          );

          if (!isMember) {
            localStorage.removeItem("activeLobby");
            navigate("/play");
            return;
          }

          handleLobbyUpdate(response.lobby);
        } else {
          localStorage.removeItem("activeLobby");
          navigate("/play");
        }
      } catch (error) {
        console.error(error);
      }
    }

    refreshLobby();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handlePlayerJoined(payload: { player: Player }) {
      setLobby((prev) => {
        if (!prev) return prev;
        const updated: LobbyType = {
          ...prev,
          players: [...prev.players, [payload.player.userId, payload.player]],
        };
        localStorage.setItem("activeLobby", JSON.stringify(updated));
        return updated;
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: `${payload.player.username} joined the lobby`,
        },
      ]);
    }

    function handlePlayerLeft(payload: { username: string }) {
      setLobby((prev) => {
        if (!prev) return prev;
        const updated: LobbyType = {
          ...prev,
          players: prev.players.filter(
            ([, player]) => player.username !== payload.username
          ),
        };
        localStorage.setItem("activeLobby", JSON.stringify(updated));
        return updated;
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: `${payload.username} left the lobby`,
        },
      ]);
    }

    function handleGameStarted() {
      navigate("/play/game");
    }

    socket.on("lobby:playerJoined", handlePlayerJoined);
    socket.on("lobby:playerLeft", handlePlayerLeft);
    socket.on("game:started", handleGameStarted);

    return () => {
      socket.off("lobby:playerJoined", handlePlayerJoined);
      socket.off("lobby:playerLeft", handlePlayerLeft);
      socket.off("game:started", handleGameStarted);
    };
  }, []);

  async function handleStartGame() {
    if (!lobby) return;

    setStarting(true);
    try {
      const response = await devDuelsService.beginGame(lobby.roomId);
      if (response.status !== "ok") {
        showPopup(response.message, "error");
        setStarting(false);
      }
    } catch (error) {
      console.error(error);
      showPopup("could not start the game, try again", "error");
      setStarting(false);
    }
  }

  const players = lobby?.players ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">
            lobby
          </h1>
          <p className="mt-1 font-display text-xs text-muted">
            room {lobby?.roomId ?? "unknown"} ·{" "}
            {lobby?.privacy === "PRIVATE" ? "private" : "public"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {lobby?.privacy === "PRIVATE" && lobby.password && (
            <div className="rounded-md border border-border bg-surface px-4 py-2 font-display text-xs text-muted">
              password <span className="text-text">{lobby.password}</span>
            </div>
          )}
          <button className="rounded-md border border-border px-4 py-2 font-display text-xs text-text transition-colors hover:border-accent hover:text-accent">
            copy invite
          </button>

          <ChangeLobbyPrivacy lobby={lobby} onUpdate={handleLobbyUpdate} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xs uppercase tracking-wider text-muted">
            players {players.length}/{lobby?.maxPlayers ?? 4}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {players.map(([userId, player]) => (
              <div
                key={userId}
                className="flex items-center justify-between rounded-md border border-border bg-bg px-4 py-3"
              >
                <span className="font-display text-sm text-text">
                  {player.username}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <LeaveLobbyButton lobby={lobby} />
            <button
              onClick={handleStartGame}
              disabled={starting}
              className="rounded-md bg-accent px-6 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {starting ? "starting..." : "start game"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-xs uppercase tracking-wider text-muted">
            activity
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {messages.length === 0 ? (
              <p className="font-display text-xs text-muted">no activity yet</p>
            ) : (
              messages.map((message) => (
                <p key={message.id} className="font-display text-xs text-muted">
                  {message.text}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}