export const OtpSuccessView = () => {
  return (
    <div className="animate-fade-in-scale flex flex-col items-center gap-4 py-4">
      <div className="rounded-full bg-primary/10 p-3">
        <svg
          className="h-10 w-10 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-lg font-semibold">Email verified successfully!</p>
        <p className="text-sm text-muted-foreground">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};