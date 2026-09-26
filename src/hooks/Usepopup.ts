import { useContext } from "react";
import { PopupContext } from "../context/PopupContext";

export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}