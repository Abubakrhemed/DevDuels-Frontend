import { createContext } from "react";

export interface SafeUser {
  _id: string;
  username: string;
  Points: number;
  status: string;
  leaderboardPts: number;
}

export interface AuthContextValue {
  user: SafeUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
