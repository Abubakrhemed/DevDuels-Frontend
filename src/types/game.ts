export type QuestionFormat = "MCQ" | "CodeSnippet" | "TrueFalse";

export interface SafeQuestion {
  question: string;
  format: QuestionFormat;
  options: string[];
  pointsAwarded: number;
  pointsSubtracted: number;
  timeAwarded: number;
  timeSubtracted: number;
  livesSubtracted: number;
}

export interface GameStatePayload {
  score: number;
  lives: number;
  currentIndex: number;
  streak: number;
  time: number;
}

export type GameOverReason =
  | "no lives remaining"
  | "no time remaining"
  | "all questions answered";

export interface GameOverPayload {
  score: number;
  reason: GameOverReason;
}

export interface GameWinner {
  userId: string;
  score: number;
}

export type GameEndPayload =
  | { tie: false; winner: GameWinner }
  | { tie: true; winners: GameWinner[] };