import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URI } from "../config/config";

interface Leader {
  username: string;
  leaderboardPts: number;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await axios.get(`${BASE_URI}/api/leaderboard`);
        setLeaders(response.data.leaders);
      } catch {
        setError("could not load the leaderboard, try again later");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">
          leaderboard
        </h1>
        <p className="mt-1 text-sm text-muted">top 100 developers by points</p>
      </div>

      {isLoading ? (
        <div className="mt-8 rounded-lg border border-border bg-surface p-10 text-center">
          <p className="font-display text-sm text-muted">loading...</p>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-lg border border-danger bg-danger-soft p-10 text-center">
          <p className="font-display text-sm text-danger">{error}</p>
        </div>
      ) : leaders.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-surface p-10 text-center">
          <p className="font-display text-sm text-muted">
            no ranked players yet
          </p>
          <p className="mt-1 text-sm text-muted">
            finish a duel to get on the board
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          {leaders.map((leader, index) => (
            <div
              key={`${leader.username}-${index}`}
              className="flex items-center justify-between border-b border-border bg-surface px-5 py-3 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 font-display text-sm text-muted">
                  {index + 1}
                </span>
                <span className="font-display text-sm text-text">
                  {leader.username}
                </span>
              </div>
              <span className="font-display text-sm text-accent">
                {leader.leaderboardPts}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}