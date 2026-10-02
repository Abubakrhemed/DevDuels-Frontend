import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { BASE_URI } from "../config/config";

export function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchEmail() {
      try {
        const response = await axios.get(
          `${BASE_URI}/api/user/${user!._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmail(response.data.user.email);
      } catch {
        setEmail(null);
      }
    }

    fetchEmail();
  }, [user, token]);

  async function handleDeleteAccount() {
    if (!user || !token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URI}/api/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      alert("Failed to delete account, try again later.");
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md py-10 px-6">
      <h1 className="font-display text-2xl font-bold text-text">Profile</h1>

      <div className="mt-6 rounded-lg border border-border bg-surface p-6 flex flex-col gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-wider text-muted">
            username
          </p>
          <p className="mt-1 font-display text-sm text-text">{user.username}</p>
        </div>

        <div>
          <p className="font-display text-xs uppercase tracking-wider text-muted">
            email
          </p>
          <p className="mt-1 font-display text-sm text-text">
            {email ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => navigate("/request-password-reset")}
          className="rounded-md bg-accent px-4 py-2.5 font-display text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Reset Password
        </button>

        <button
          onClick={handleDeleteAccount}
          className="rounded-md border border-danger px-4 py-2.5 font-display text-sm font-medium text-danger transition-opacity hover:bg-danger hover:text-bg"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}