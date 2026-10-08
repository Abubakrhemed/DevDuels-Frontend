import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import lottie from "lottie-web";
import { socket } from "../socket/socket";
import { useAuth } from "../hooks/useAuth";
import { usePopup } from "../hooks/Usepopup";
import fireAnimationData from "../assets/Fire.json";
import type { Lobby } from "../types/Lobby";
import type {
  SafeQuestion,
  GameStatePayload,
  GameOverPayload,
  GameEndPayload,
} from "../types/game";
import type { OpponentUpdate } from "../types/socketEvents";

type GamePhase = "loading" | "playing" | "over" | "ended";
type AnswerResult = "correct" | "wrong" | null;

interface OpponentState {
  username: string;
  score: number;
  lives: number;
  streak: number;
}

function readActiveLobby(): Lobby | null {
  const stored = localStorage.getItem("activeLobby");
  return stored ? (JSON.parse(stored) as Lobby) : null;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function Game() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showPopup } = usePopup();

  const [roomId] = useState<string | null>(
    () => readActiveLobby()?.roomId ?? null
  );
  const [usernames] = useState<Map<string, string>>(() => {
    const lobby = readActiveLobby();
    if (!lobby) return new Map();
    return new Map(lobby.players.map(([id, player]) => [id, player.username]));
  });

  const [phase, setPhase] = useState<GamePhase>("loading");
  const [question, setQuestion] = useState<SafeQuestion | null>(null);
  const [stats, setStats] = useState<GameStatePayload>({
    score: 0,
    lives: 3,
    streak: 0,
    currentIndex: 0,
    time: 60000,
  });
  const [timeLeft, setTimeLeft] = useState(60000);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<AnswerResult>(null);
  const [opponents, setOpponents] = useState<Map<string, OpponentState>>(
    new Map()
  );
  const [overInfo, setOverInfo] = useState<GameOverPayload | null>(null);
  const [endInfo, setEndInfo] = useState<GameEndPayload | null>(null);
  const [showStreakFlash, setShowStreakFlash] = useState(false);

  const prevScoreRef = useRef(0);
  const prevStreakRef = useRef(0);
  const awaitingResultRef = useRef(false);
  const fireRef = useRef<HTMLDivElement>(null);

  const onStreak = stats.streak >= 3;

  // lottie fire animation
  useEffect(() => {
    if (!fireRef.current || !onStreak) return;

    const anim = lottie.loadAnimation({
      container: fireRef.current,
      animationData: fireAnimationData,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });

    return () => anim.destroy();
  }, [onStreak]);

  // orange flash on streak activation
  useEffect(() => {
    if (!showStreakFlash) return;

    const timeout = setTimeout(() => setShowStreakFlash(false), 400);
    return () => clearTimeout(timeout);
  }, [showStreakFlash]);

  useEffect(() => {
    if (!user || !roomId) {
      navigate("/play");
      return;
    }

    socket.emit("game:start", roomId, user._id);

    function handleQuestion(next: SafeQuestion, state?: GameStatePayload) {
      setQuestion(next);

      if (state) {
        if (awaitingResultRef.current) {
          setLastResult(state.score > prevScoreRef.current ? "correct" : "wrong");
          awaitingResultRef.current = false;
        }

        // detect streak activation: was below 3, now at 3
        if (prevStreakRef.current < 3 && state.streak >= 3) {
          setShowStreakFlash(true);
        }

        prevScoreRef.current = state.score;
        prevStreakRef.current = state.streak;
        setStats(state);
        setTimeLeft(state.time);
      } else {
        prevScoreRef.current = 0;
        prevStreakRef.current = 0;
        setLastResult(null);
        setStats({ score: 0, lives: 3, streak: 0, currentIndex: 0, time: 60000 });
        setTimeLeft(60000);
      }

      setPhase("playing");
      setSubmitting(false);
    }

    function handleOpponentUpdate(payload: OpponentUpdate) {
      if (payload.userId === user!._id) return;
      setOpponents((prev) => {
        const next = new Map(prev);
        next.set(payload.userId, {
          username: payload.username,
          score: payload.score,
          lives: payload.lives,
          streak: payload.streak ?? 0,
        });
        return next;
      });
    }

    function handleOver(payload: GameOverPayload) {
      setOverInfo(payload);
      setPhase("over");
      setSubmitting(false);
      awaitingResultRef.current = false;
    }

    function handleEnd(payload: GameEndPayload) {
      setEndInfo(payload);
      setPhase("ended");
    }

    function handleReturn() {
      navigate("/play/lobby");
    }

    function handleError(message: string) {
      showPopup(message, "error");
    }

    socket.on("game:questionSent", handleQuestion);
    socket.on("game:opponentUpdate", handleOpponentUpdate);
    socket.on("game:over", handleOver);
    socket.on("game:end", handleEnd);
    socket.on("game:returnToLobby", handleReturn);
    socket.on("game:error", handleError);

    return () => {
      socket.off("game:questionSent", handleQuestion);
      socket.off("game:opponentUpdate", handleOpponentUpdate);
      socket.off("game:over", handleOver);
      socket.off("game:end", handleEnd);
      socket.off("game:returnToLobby", handleReturn);
      socket.off("game:error", handleError);
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const id = setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1000));
    }, 1000);

    return () => clearInterval(id);
  }, [phase]);

  function submitAnswer(answer: string) {
    if (!user || !roomId || phase !== "playing" || submitting) return;

    setSubmitting(true);
    awaitingResultRef.current = true;
    socket.emit(
      "game:answerSubmited",
      answer,
      user._id,
      roomId,
      (response) => {
        if (response && response.status === "error") {
          showPopup(response.message, "error");
          setSubmitting(false);
          awaitingResultRef.current = false;
        }
      }
    );
  }

  const opponentList = Array.from(opponents.entries());

  if (phase === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-display text-sm text-muted">starting game...</p>
      </div>
    );
  }

  if (phase === "ended") {
    const winnerIds = new Set(
      endInfo
        ? endInfo.tie
          ? endInfo.winners.map((w) => w.userId)
          : [endInfo.winner.userId]
        : []
    );

    const finalPlayers = Array.from(usernames.entries())
      .map(([id, name]) => ({
        id,
        name,
        score:
          id === user?._id
            ? overInfo?.score ?? stats.score
            : opponents.get(id)?.score ?? 0,
        isWinner: winnerIds.has(id),
      }))
      .sort((a, b) => b.score - a.score);
  
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="font-display text-xs uppercase tracking-widest text-accent">
          game over
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-text">
          {endInfo?.tie ? "it's a tie" : "final standings"}
        </h1>
  
        <div className="mt-8 flex flex-col gap-3">
          {finalPlayers.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                p.isWinner
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-danger bg-danger-soft"
              }`}
            >
              <span
                className={`font-display text-sm ${
                  p.isWinner ? "text-yellow-400" : "text-danger"
                }`}
              >
                {p.name}
                {p.id === user?._id && " (you)"}
              </span>
              <span
                className={`font-display text-sm ${
                  p.isWinner ? "text-yellow-400" : "text-danger"
                }`}
              >
                {p.score}
              </span>
            </div>
          ))}
        </div>
  
        <p className="mt-8 font-display text-xs text-muted">
          returning to lobby...
        </p>
      </div>
    );
  }

  if (phase === "over" && overInfo) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="font-display text-xs uppercase tracking-widest text-danger">
          you're out
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-text">
          {overInfo.reason}
        </h1>
        <p className="mt-4 font-display text-sm text-text">
          final score <span className="text-accent">{overInfo.score}</span>
        </p>
        <p className="mt-8 font-display text-xs text-muted">
          waiting for other players to finish...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {showStreakFlash && (
        <div className="animate-streak-flash pointer-events-none fixed inset-0 z-50 bg-orange-500/20" />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-display text-sm text-text">
            {onStreak && (
              <div ref={fireRef} className="h-6 w-6 shrink-0" />
            )}
            score <span className="text-accent">{stats.score}</span>
            {onStreak && (
              <span className="rounded-full border border-orange-400 px-2 py-0.5 font-display text-xs text-orange-400">
                x2
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < stats.lives ? "bg-danger" : "bg-border"
                }`}
              />
            ))}
          </div>
          {lastResult && (
            <span
              className={`rounded-full px-2 py-0.5 font-display text-xs ${
                lastResult === "correct"
                  ? "border border-accent text-accent"
                  : "border border-danger text-danger"
              }`}
            >
              {lastResult}
            </span>
          )}
        </div>
        <div className="rounded-md border border-border bg-surface px-4 py-2 font-display text-sm text-text">
          {formatTime(timeLeft)}
        </div>
      </div>

      {opponentList.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {opponentList.map(([userId, opponent]) => {
            const opponentOnStreak = opponent.streak >= 3;
            return (
              <div
                key={userId}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
                  opponentOnStreak
                    ? "border-orange-400 bg-orange-400/10"
                    : "border-border bg-surface"
                }`}
              >
                <span className="font-display text-xs text-muted">
                  {opponent.username}
                </span>
                <span className="font-display text-xs text-text">
                  {opponent.score}
                </span>
                {opponentOnStreak && (
                  <span className="font-display text-xs text-orange-400">
                    x2
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${
                        i < opponent.lives ? "bg-danger" : "bg-border"
                      }`}
                    />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {question && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <span className="font-display text-xs uppercase tracking-wider text-muted">
            {question.format}
          </span>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-display text-sm leading-relaxed text-text">
            {question.question}
          </pre>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(question.options ?? []).map((option) => (
              <button
                key={option}
                onClick={() => submitAnswer(option)}
                disabled={submitting}
                className="rounded-md border border-border bg-bg px-4 py-3 text-left font-display text-sm text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}