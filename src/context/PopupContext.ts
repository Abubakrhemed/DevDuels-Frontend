import { createContext } from "react";

export type PopupVariant = "info" | "success" | "error";

export interface PopupContextValue {
  showPopup: (message: string, variant?: PopupVariant) => void;
}

export const PopupContext = createContext<PopupContextValue | undefined>(
  undefined
);