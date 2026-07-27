import { Link } from "react-router";

export function Hero() {
  return (
    <section className="border-b border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-display text-xs uppercase tracking-widest text-accent">
              real-time · head-to-head
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-text sm:text-4xl lg:text-5xl">
              Answer faster.
              <br />
              Answer right.
              <br />
              Win the duel.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              DevDuels pits you against another developer in a live quiz.
              Same questions, same clock, no mercy — three wrong answers and
              you're out.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/play"
                className="rounded-md bg-accent px-6 py-3 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                start a duel
              </Link>
              <Link
                to="/leaderboard"
                className="rounded-md border border-border px-6 py-3 font-display text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
              >
                view leaderboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-3">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs text-muted">
                  player_01
                </span>
                <span className="font-display text-xs text-accent">
                  score 340
                </span>
              </div>
              <pre className="mt-3 overflow-x-auto font-display text-xs leading-relaxed text-text">
{`function isPalindrome(s) {
  return s === [...s]
    .reverse()
    .join("");
}`}
              </pre>
            </div>

            <div className="flex flex-row items-center justify-center gap-2 lg:flex-col lg:gap-1">
              <span className="font-display text-lg font-bold text-danger">
                VS
              </span>
              <span className="hero-cursor h-4 w-px bg-accent" />
            </div>

            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs text-muted">
                  player_02
                </span>
                <span className="font-display text-xs text-muted">
                  score 285
                </span>
              </div>
              <pre className="mt-3 overflow-x-auto font-display text-xs leading-relaxed text-text">
{`function isPalindrome(s) {
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (s[i++] !== s[j--])
      return false;
  }
  return true;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}