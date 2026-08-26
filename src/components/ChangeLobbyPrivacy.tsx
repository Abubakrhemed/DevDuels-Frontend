import { useState } from "react";
import { devDuelsService } from "../services/DevDuelsService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import type { Lobby } from "../types/Lobby";

interface ChangeLobbyPrivacyProps {
  lobby: Lobby | null;
  onUpdate: (lobby: Lobby) => void;
}

export function ChangeLobbyPrivacy({
  lobby,
  onUpdate,
}: ChangeLobbyPrivacyProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestPrivacyChange() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!lobby) {
      navigate("/play");
      return;
    }

    const nextPrivacy = lobby.privacy === "PRIVATE" ? "PUBLIC" : "PRIVATE";

    setIsSubmitting(true);
    try {
      const response = await devDuelsService.updateLobbyPrivacy(
        lobby.roomId,
        user._id,
        nextPrivacy
      );

      if (response.status === "ok") {
        onUpdate(response.lobby);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      onClick={requestPrivacyChange}
      disabled={isSubmitting}
      className="rounded-md border border-border px-4 py-2 font-display text-xs text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
    >
      {isSubmitting
        ? "updating..."
        : lobby?.privacy === "PRIVATE"
          ? "make public"
          : "make private"}
    </button>
  );
}