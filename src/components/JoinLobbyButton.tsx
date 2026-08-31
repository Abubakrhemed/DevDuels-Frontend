import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { devDuelsService } from "../services/DevDuelsService";
import type { Lobby } from "../types/Lobby";

interface JoinLobbyProps {
  roomId: string;
  password?: string;
  variant?: "primary" | "secondary";
}

export function JoinLobbyButton({
  roomId,
  password = "",
  variant = "secondary",
}: JoinLobbyProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleJoin() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!roomId) {
      return;
    }

    const stored = localStorage.getItem("activeLobby");
    if (stored) {
      const activeLobby: Lobby = JSON.parse(stored);
      if (activeLobby.roomId === roomId) {
        navigate("/play/lobby");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await devDuelsService.requestJoin(
        roomId,
        user._id,
        password
      );

      if (response.status === "ok") {
        localStorage.setItem("activeLobby", JSON.stringify(response.lobby));
        navigate("/play/lobby");
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const className =
    variant === "primary"
      ? "mt-5 rounded-md bg-accent px-4 py-2 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      : "rounded-md border border-border px-4 py-2 font-display text-xs text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-60";

  return (
    <button className={className} onClick={handleJoin} disabled={isSubmitting}>
      {isSubmitting ? "joining..." : "join"}
    </button>
  );
}