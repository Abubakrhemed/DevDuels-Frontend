import { useState } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-text">
            dev<span className="text-accent">duels</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-display text-sm text-muted transition-colors hover:text-text"
          >
            home
          </Link>
          <Link
            to="/play"
            className="font-display text-sm text-muted transition-colors hover:text-text"
          >
            play
          </Link>
          <Link
            to="/leaderboard"
            className="font-display text-sm text-muted transition-colors hover:text-text"
          >
            leaderboard
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <button className="font-display text-sm text-muted transition-colors hover:text-text">
            <Link to="/login">Sign In</Link>
          </button>
          <button className="rounded-md bg-accent px-4 py-2 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90">
            <Link to="/register">Sign Up</Link>
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="toggle menu"
            aria-expanded={isOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text"
          >
            {isOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="font-display text-sm text-muted transition-colors hover:text-text"
            >
              home
            </Link>
            <Link
              to="/play"
              onClick={() => setIsOpen(false)}
              className="font-display text-sm text-muted transition-colors hover:text-text"
            >
              play
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setIsOpen(false)}
              className="font-display text-sm text-muted transition-colors hover:text-text"
            >
              leaderboard
            </Link>
            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              <button className="text-left font-display text-sm text-muted transition-colors hover:text-text">
                sign in
              </button>
              <button className="rounded-md bg-accent px-4 py-2 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90">
                sign up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
