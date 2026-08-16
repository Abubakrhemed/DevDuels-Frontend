interface OpponentStatus {
  userId: string;
  username: string;
  score: number;
  lives: number;
}

const mockQuestion = {
  format: "CodeSnippet" as const,
  question:
    "What does this function return for input 'level'?\n\nfunction check(s) {\n  return s === [...s].reverse().join('');\n}",
  options: ["true", "false", "undefined", "throws an error"],
};

const mockOpponents: OpponentStatus[] = [
  { userId: "2", username: "player_02", score: 285, lives: 2 },
];

export function Game() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="font-display text-sm text-text">
            score <span className="text-accent">340</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-danger" />
            <span className="h-2 w-2 rounded-full bg-danger" />
            <span className="h-2 w-2 rounded-full bg-danger" />
          </div>
        </div>
        <div className="rounded-md border border-border bg-surface px-4 py-2 font-display text-sm text-text">
          0:22
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {mockOpponents.map((opponent) => (
          <div
            key={opponent.userId}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2"
          >
            <span className="font-display text-xs text-muted">
              {opponent.username}
            </span>
            <span className="font-display text-xs text-text">
              {opponent.score}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
              <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <span className="font-display text-xs uppercase tracking-wider text-muted">
          {mockQuestion.format}
        </span>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-display text-sm leading-relaxed text-text">
          {mockQuestion.question}
        </pre>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mockQuestion.options.map((option) => (
            <button
              key={option}
              className="rounded-md border border-border bg-bg px-4 py-3 text-left font-display text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
