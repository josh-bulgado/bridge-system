import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

// TypeScript Interfaces
interface VerifyOTPFormProps {
  email?: string;
}

interface OTPState {
  code: string[]; // Array of 6 digits
  timeRemaining: number; // seconds
  resendCooldown: number; // seconds
  attempts: number;
  isVerifying: boolean;
  error: string | null;
  success: boolean;
  isResending: boolean;
}

export const VerifyOTPForm = ({
  email = "agentbea12@gmail.com",
}: VerifyOTPFormProps) => {
  const navigate = useNavigate();
  
  // State management
  const [otpState, setOtpState] = useState<OTPState>({
    code: ["", "", "", "", "", ""],
    timeRemaining: 600, // 10 minutes in seconds
    resendCooldown: 0, // No initial cooldown
    attempts: 0,
    isVerifying: false,
    error: null,
    success: false,
    isResending: false,
  });

  // Refs for input fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpState.timeRemaining > 0 && !otpState.success) {
      interval = setInterval(() => {
        setOtpState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpState.timeRemaining, otpState.success]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpState.resendCooldown > 0) {
      interval = setInterval(() => {
        setOtpState((prev) => ({
          ...prev,
          resendCooldown: prev.resendCooldown - 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpState.resendCooldown]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Only allow single digit
    if (value.length > 1) return;

    const newCode = [...otpState.code];
    newCode[index] = value;

    setOtpState((prev) => ({
      ...prev,
      code: newCode,
      error: null, // Clear error when user types
    }));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down events
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpState.code[index] && index > 0) {
        // If current input is empty, focus previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newCode = [...otpState.code];
        newCode[index - 1] = "";
        setOtpState((prev) => ({ ...prev, code: newCode }));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only accept 6-digit numeric values
    if (!/^\d{6}$/.test(pastedData)) {
      setOtpState((prev) => ({
        ...prev,
        error: "Please paste a valid 6-digit code",
      }));
      return;
    }

    const newCode = pastedData.split("");
    setOtpState((prev) => ({
      ...prev,
      code: newCode,
      error: null,
    }));

    // Focus last input
    inputRefs.current[5]?.focus();
  };

  // Check if all boxes are filled
  const isCodeComplete = otpState.code.every((digit) => digit !== "");

  // Check if code is expired
  const isCodeExpired = otpState.timeRemaining === 0;

  // Handle verify button click
  const handleVerify = async () => {
    if (!isCodeComplete || otpState.isVerifying || isCodeExpired) return;

    setOtpState((prev) => ({ ...prev, isVerifying: true, error: null }));

    try {
      const enteredCode = otpState.code.join("");
      await authService.verifyEmail(email, enteredCode);

      // Success state
      setOtpState((prev) => ({
        ...prev,
        isVerifying: false,
        success: true,
        error: null,
      }));

      // Get user info from storage to determine redirect
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      // Redirect to appropriate dashboard after 2 seconds
      setTimeout(() => {
        if (user?.role === "admin") {
          navigate("/admin");
        } else if (user?.role === "staff") {
          navigate("/staff");
        } else {
          navigate("/resident");
        }
      }, 2000);
    } catch (error: any) {
      // Error state
      const newAttempts = otpState.attempts + 1;
      const maxAttempts = 5;

      if (newAttempts >= maxAttempts) {
        setOtpState((prev) => ({
          ...prev,
          isVerifying: false,
          error:
            "🚫 Too many failed attempts. Please resend code.",
          attempts: newAttempts,
        }));
      } else {
        setOtpState((prev) => ({
          ...prev,
          isVerifying: false,
          error: `❌ ${error.message}`,
          attempts: newAttempts,
        }));

        // Trigger shake animation and clear inputs after 1 second
        const inputs = inputRefs.current;
        inputs.forEach((input) => {
          if (input) {
            input.classList.add("animate-shake");
          }
        });

        setTimeout(() => {
          setOtpState((prev) => ({
            ...prev,
            code: ["", "", "", "", "", ""],
            error: prev.error, // Keep error message
          }));

          inputs.forEach((input) => {
            if (input) {
              input.classList.remove("animate-shake");
            }
          });

          inputRefs.current[0]?.focus();
        }, 1000);
      }
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (otpState.resendCooldown > 0 || otpState.isResending) return;

    setOtpState((prev) => ({ ...prev, isResending: true, error: null }));

    try {
      await authService.resendOtp(email);
      
      setOtpState((prev) => ({
        ...prev,
        isResending: false,
        timeRemaining: 600, // Reset to 10 minutes
        resendCooldown: 60, // 60 seconds cooldown
        code: ["", "", "", "", "", ""], // Clear inputs
        error: null,
        attempts: 0, // Reset attempts
      }));

      // Focus first input
      inputRefs.current[0]?.focus();

      // Show success message briefly
      setOtpState((prev) => ({
        ...prev,
        error: "✅ New code sent successfully! Check your email.",
      }));
      setTimeout(() => {
        setOtpState((prev) => ({ ...prev, error: null }));
      }, 3000);
    } catch (error: any) {
      setOtpState((prev) => ({
        ...prev,
        isResending: false,
        error: `❌ ${error.message}`,
      }));
    }
  };

  // Determine input border color
  const getInputBorderColor = (index: number) => {
    if (otpState.success) return "border-primary";
    if (otpState.error && otpState.error.includes("Invalid"))
      return "border-destructive";
    if (isCodeExpired) return "border-destructive";
    return "border-input";
  };

  return (
    <>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* Success Animation */}
        {otpState.success && (
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
              <p className="text-lg font-semibold">
                Email verified successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        {/* OTP Input Boxes */}
        {!otpState.success && (
          <>
            <div className="space-y-3">
              {/* Single row of 6 inputs */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpState.code[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`h-12 w-12 rounded-md border bg-background text-center text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${getInputBorderColor(index)}`}
                    disabled={otpState.isVerifying || otpState.success}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
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
                Code expires in{" "}
                <span
                  className={`font-mono font-semibold ${otpState.timeRemaining < 60 ? "text-destructive" : "text-foreground"}`}
                >
                  {formatTime(otpState.timeRemaining)}
                </span>
              </p>
            </div>

            {isCodeExpired && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-sm text-destructive text-center">
                  Code expired. Please request a new one.
                </p>
              </div>
            )}

            {/* Error Message */}
            {otpState.error && !isCodeExpired && (
              <div
                className={`rounded-md border p-3 ${
                  otpState.error.includes("✅")
                    ? "border-primary/50 bg-primary/10"
                    : "border-destructive/50 bg-destructive/10"
                }`}
                aria-live="polite"
              >
                <p
                  className={`text-sm text-center ${
                    otpState.error.includes("✅")
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {otpState.error.replace("✅", "").replace("❌", "").trim()}
                </p>
                {otpState.attempts > 0 &&
                  otpState.attempts < 5 &&
                  !otpState.error.includes("✅") && (
                    <p className="mt-1 text-xs text-center text-muted-foreground">
                      {5 - otpState.attempts} {5 - otpState.attempts === 1 ? "attempt" : "attempts"} remaining
                    </p>
                  )}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={
                !isCodeComplete ||
                otpState.isVerifying ||
                isCodeExpired ||
                otpState.attempts >= 5
              }
              className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {otpState.isVerifying ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend Code */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={otpState.resendCooldown > 0 || otpState.isResending}
                className="inline-flex items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
              >
                {otpState.isResending
                  ? "Sending..."
                  : otpState.resendCooldown > 0
                    ? `Resend code in ${otpState.resendCooldown}s`
                    : "Resend code"}
              </button>
            </div>

            {/* Back Link */}
            <div className="text-center border-t pt-4">
              <Link
                to="/sign-in"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Custom Animations Styles */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
    </>
  );
};
