import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <span className="font-display text-lg font-bold text-text">
              dev<span className="text-accent">duels</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Head-to-head coding quizzes. Answer fast, answer right, outlast
              your opponent.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-xs uppercase tracking-wider text-muted">
                play
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    to="/play"
                    className="text-sm text-text transition-colors hover:text-accent"
                  >
                    find a match
                  </Link>
                </li>
                <li>
                  <Link
                    to="/leaderboard"
                    className="text-sm text-text transition-colors hover:text-accent"
                  >
                    leaderboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-wider text-muted">
                project
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-text transition-colors hover:text-accent"
                  >
                    source
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-text transition-colors hover:text-accent"
                  >
                    about
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-display text-xs text-muted">
            © {new Date().getFullYear()} devduels
          </p>
          <p className="font-display text-xs text-muted">built by Abubakr Hemed</p>
        </div>
      </div>
    </footer>
  );
}