import { useAuth } from "../hooks/useAuth";
import { devDuelsService } from "../services/DevDuelsService";
import { useNavigate } from "react-router";
import { type Lobby } from "../types/Lobby";

interface LeaveLobbyProps {
  lobby: Lobby | null;
}

export function LeaveLobbyButton({ lobby }: LeaveLobbyProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleLeave() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!lobby) {
      navigate("/play");
      return;
    }

    try {
      const response = await devDuelsService.leaveLobby(lobby.roomId, user._id);

      if (response.status === "ok") {
        navigate("/play")
        
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleLeave}
      className="rounded-md border border-border px-4 py-2 font-display text-xs text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
    >
      Leave Lobby
    </button>
  );
}
