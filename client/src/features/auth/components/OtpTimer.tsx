interface OtpTimerProps {
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  isExpired: boolean;
}

export const OtpTimer = ({ timeRemaining, formatTime, isExpired }: OtpTimerProps) => {
  if (isExpired) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
        <p className="text-sm text-destructive text-center">
          Code expired. Please request a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 rounded-md bg-muted px-3 py-2">
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
        Code expires in{' '}
        <span
          className={`font-mono font-semibold ${
            timeRemaining < 60 ? 'text-destructive' : 'text-foreground'
          }`}
        >
          {formatTime(timeRemaining)}
        </span>
      </p>
    </div>
  );
};