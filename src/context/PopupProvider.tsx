import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PopupContext } from "./PopupContext";
import type { PopupVariant } from "./PopupContext";
import { Popup } from "../components/Popup";

interface ActivePopup {
  message: string;
  variant: PopupVariant;
}

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<ActivePopup | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPopup = useCallback(
    (message: string, variant: PopupVariant = "info") => {
      setPopup({ message, variant });
    },
    []
  );

  useEffect(() => {
    if (!popup) return;

    timeoutRef.current = setTimeout(() => setPopup(null), 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [popup]);

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      {popup && (
        <Popup
          message={popup.message}
          variant={popup.variant}
          onClose={() => setPopup(null)}
        />
      )}
    </PopupContext.Provider>
  );
}