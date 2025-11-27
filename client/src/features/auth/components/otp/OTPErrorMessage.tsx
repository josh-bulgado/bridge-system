interface OTPErrorMessageProps {
  message: string | null;
  attempts?: number;
  maxAttempts?: number;
  type?: "error" | "success" | "info";
}

export const OTPErrorMessage = ({
  message,
  attempts = 0,
  maxAttempts = 5,
  type = "error",
}: OTPErrorMessageProps) => {
  if (!message) return null;

  const isSuccess = type === "success" || message.includes("✅");
  const isError = type === "error" && !isSuccess;

  const borderColor = isSuccess
    ? "border-primary/50"
    : "border-destructive/50";
  const bgColor = isSuccess ? "bg-primary/10" : "bg-destructive/10";
  const textColor = isSuccess ? "text-primary" : "text-destructive";

  // Clean message from emoji indicators
  const cleanMessage = message.replace("✅", "").replace("❌", "").trim();

  const showAttempts = isError && attempts > 0 && attempts < maxAttempts;

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-3.5`}
      role="alert"
      aria-live="polite"
    >
      <p className={`text-sm text-center font-medium ${textColor}`}>
        {cleanMessage}
      </p>
      {showAttempts && (
        <p className="mt-2 text-xs text-center text-muted-foreground">
          {maxAttempts - attempts}{" "}
          {maxAttempts - attempts === 1 ? "attempt" : "attempts"} remaining
        </p>
      )}
    </div>
  );
};

export default OTPErrorMessage;
