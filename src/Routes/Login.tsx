import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string })?.from ?? "/play";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo);
    } catch {
      setError("incorrect username or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-bold text-text">
          dev<span className="text-accent">duels</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 sm:p-8">
          <h1 className="font-display text-2xl font-bold text-text">
            welcome back
          </h1>
          <p className="mt-1 text-sm text-muted">
            log in to challenge another developer
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="font-display text-xs uppercase tracking-wider text-muted">
                username
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent"
              />
            </div>

            <div>
              <label className="font-display text-xs uppercase tracking-wider text-muted">
                password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent"
              />
            </div>

            {error && (
              <p className="font-display text-xs text-danger">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-md bg-accent px-4 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "logging in..." : "log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            don't have an account?{" "}
            <Link to="/register" className="text-accent hover:underline">
              sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
