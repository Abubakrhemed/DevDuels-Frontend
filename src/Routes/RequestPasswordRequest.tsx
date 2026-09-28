import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "../components/ThemeToggle";
import { devDuelsService } from "../services/DevDuelsService";

export function RequestPasswordRequest() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleRequestReset(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const response = await devDuelsService.requestPasswordReset(
        username,
        email,
      );

      if (response.message) {
        alert(response.message);
      }
    } catch (err) {
      console.log(err)
      setError("email or username is incorrect");
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
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-muted">Enter Email & Username</p>

          <form onSubmit={handleRequestReset} className="mt-6 flex flex-col gap-4">
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
                email
              </label>
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 font-display text-sm text-text placeholder:text-muted focus:border-accent"
              />
            </div>

            {error && (
              <p className="font-display text-xs text-danger">{error}</p>
            )}

            <button
              type="submit"
              className="mt-2 rounded-md bg-accent px-4 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
