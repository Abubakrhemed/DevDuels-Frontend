import { useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { BASE_URI } from "../config/config";
import { AuthContext } from "./AuthContext";
import type { SafeUser } from "./AuthContext";

const STORAGE_KEY = "devduels_auth";

function getStoredAuth(): { user: SafeUser | null; token: string | null } {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null, token: null };
    try {
        const parsed = JSON.parse(stored);
        return { user: parsed.user ?? null, token: parsed.token ?? null };
    } catch {
        return { user: null, token: null };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SafeUser | null>(
        () => getStoredAuth().user
    );
    const [token, setToken] = useState<string | null>(
        () => getStoredAuth().token
    );
    const [isLoading] = useState(false);

    async function login(username: string, password: string) {
        const response = await axios.post(`${BASE_URI}/api/user/login`, {
            username,
            password,
        });
        const { user: loggedInUser, token: newToken } = response.data;
        setUser(loggedInUser);
        setToken(newToken);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: loggedInUser, token: newToken })
        );
    }

    async function register(username: string, password: string) {
        await axios.post(`${BASE_URI}/api/user/register`, {
            username,
            password,
        });
        await login(username, password);
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    return (
        <AuthContext.Provider
      value= {{ user, token, isLoading, login, register, logout }
}
    >
    { children }
    </AuthContext.Provider>
  );
}