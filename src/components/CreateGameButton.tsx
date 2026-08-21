import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { devDuelsService } from "../services/DevDuelsService";

export function CreateGameButton() {
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleCreateGame() {
    if (!user) {
      navigate("/login", { state: { from: "/play" } });
      return;
    }

    try {
      const response = await devDuelsService.createLobby(user._id);
      if (response.status === "ok") {
        navigate("/play/lobby", { state: { lobby: response.lobby } });
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      onClick={handleCreateGame}
      className="rounded-md bg-accent px-5 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90"
    >
      create game
    </button>
  );
}