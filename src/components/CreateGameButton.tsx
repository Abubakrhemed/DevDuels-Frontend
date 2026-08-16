import { useNavigate } from "react-router";
import { socket } from "../socket/socket";
import { useAuth } from "../hooks/useAuth";

interface LobbyCreateSuccess {
  status: "ok";
  roomId: string;
  lobby: unknown;
}

interface LobbyCreateError {
  status: "error";
  message: string;
}

type LobbyCreateResponse = LobbyCreateSuccess | LobbyCreateError;

export function CreateGameButton() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleCreateGame() {
    if (!user){
        navigate("/login",{state:{from:"/play"}})
        return
    }
    
    socket.emit("lobby:create", user._id, (response: LobbyCreateResponse) => {
      if (response.status === "ok") {
        navigate("/play/lobby", { state: { lobby: response.lobby } });
      } else {
        console.error(response.message);
      }
    });
  }

  return (
    <button
      onClick={handleCreateGame}
      className="rounded-md bg-accent px-5 py-2.5 font-display text-sm font-medium text-bg"
    >
      create game
    </button>
  );
}
