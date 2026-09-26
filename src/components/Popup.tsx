type PopupVariant = "info" | "success" | "error";

interface PopupProps {
  message: string;
  variant?: PopupVariant;
  onClose?: () => void;
}

const variantStyles: Record<PopupVariant, string> = {
  info: "border-border bg-surface text-text",
  success: "border-accent bg-accent-soft text-accent",
  error: "border-danger bg-danger-soft text-danger",
};

export function Popup({ message, variant = "info", onClose }: PopupProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end">
      <div
        className={`flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg sm:w-auto ${variantStyles[variant]}`}
      >
        <p className="flex-1 font-display text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          aria-label="dismiss message"
          className="shrink-0 text-current opacity-70 transition-opacity hover:opacity-100"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}