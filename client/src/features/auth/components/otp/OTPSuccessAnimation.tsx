interface OTPSuccessAnimationProps {
  title?: string;
  subtitle?: string;
}

export const OTPSuccessAnimation = ({
  title = "Email verified successfully!",
  subtitle = "Redirecting to your dashboard...",
}: OTPSuccessAnimationProps) => {
  return (
    <div className="animate-fade-in-scale flex flex-col items-center gap-4 py-8">
      <div className="rounded-full bg-primary/10 p-4">
        <svg
          className="h-12 w-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OTPSuccessAnimation;
