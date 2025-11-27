import { useEffect, useState } from "react";

interface OTPTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  isActive?: boolean;
}

export const OTPTimer = ({
  initialSeconds,
  onExpire,
  isActive = true,
}: OTPTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);

  useEffect(() => {
    setTimeRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || timeRemaining === 0) {
      if (timeRemaining === 0 && onExpire) {
        onExpire();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isActive, onExpire]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isExpired = timeRemaining === 0;
  const isLowTime = timeRemaining < 60 && timeRemaining > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2.5 rounded-lg bg-muted px-4 py-3">
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <p className="text-sm text-muted-foreground">
          Code expires in{" "}
          <span
            className={`font-mono font-bold ${isLowTime ? "text-destructive" : "text-foreground"}`}
          >
            {formatTime(timeRemaining)}
          </span>
        </p>
      </div>

      {isExpired && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3.5">
          <p className="text-sm text-destructive text-center font-medium">
            Code expired. Please request a new one.
          </p>
        </div>
      )}
    </div>
  );
};

export default OTPTimer;
