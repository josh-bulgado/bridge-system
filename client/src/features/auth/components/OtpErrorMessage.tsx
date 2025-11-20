interface OtpErrorMessageProps {
  error: string;
  attempts: number;
  maxAttempts: number;
}

export const OtpErrorMessage = ({ error, attempts, maxAttempts }: OtpErrorMessageProps) => {
  const isSuccessMessage = error.includes('✅') || error.includes('sent successfully');
  const cleanedError = error.replace(/[✅❌]/g, '').trim();
  
  return (
    <div
      className={`rounded-md border p-3 ${
        isSuccessMessage
          ? 'border-primary/50 bg-primary/10'
          : 'border-destructive/50 bg-destructive/10'
      }`}
      aria-live="polite"
    >
      <p
        className={`text-sm text-center ${
          isSuccessMessage ? 'text-primary' : 'text-destructive'
        }`}
      >
        {cleanedError}
      </p>
      {attempts > 0 && attempts < maxAttempts && !isSuccessMessage && (
        <p className="mt-1 text-xs text-center text-muted-foreground">
          {maxAttempts - attempts} {maxAttempts - attempts === 1 ? 'attempt' : 'attempts'} remaining
        </p>
      )}
    </div>
  );
};