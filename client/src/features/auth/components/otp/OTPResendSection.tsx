import { useEffect, useState } from "react";

interface OTPResendSectionProps {
  onResend: () => Promise<void>;
  cooldownSeconds?: number;
  disabled?: boolean;
}

export const OTPResendSection = ({
  onResend,
  cooldownSeconds = 60,
  disabled = false,
}: OTPResendSectionProps) => {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending || disabled) return;

    setIsResending(true);
    try {
      await onResend();
      setCooldown(cooldownSeconds);
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsResending(false);
    }
  };

  const isDisabled = cooldown > 0 || isResending || disabled;

  return (
    <div className="flex flex-col items-center gap-2 pt-8 pb-6">
      <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
      <button
        type="button"
        onClick={handleResend}
        disabled={isDisabled}
        className="inline-flex items-center justify-center text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50 transition-colors"
      >
        {isResending
          ? "Sending..."
          : cooldown > 0
            ? `Resend code in ${cooldown}s`
            : "Resend code"}
      </button>
    </div>
  );
};

export default OTPResendSection;
