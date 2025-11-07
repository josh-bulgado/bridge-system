import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Link } from "react-router-dom";

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
  // State management
  const [otpState, setOtpState] = useState<OTPState>({
    code: ["", "", "", "", "", ""],
    timeRemaining: 300, // 5 minutes in seconds
    resendCooldown: 30, // 30 seconds
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

    // TODO: Replace with actual API call
    console.log("Verifying OTP:", otpState.code.join(""));

    // Simulate API call
    setTimeout(() => {
      const enteredCode = otpState.code.join("");
      const isValidCode = enteredCode === "123456"; // Mock validation

      if (isValidCode) {
        // Success state
        setOtpState((prev) => ({
          ...prev,
          isVerifying: false,
          success: true,
          error: null,
        }));

        // Simulate redirect after 2 seconds
        setTimeout(() => {
          console.log("Redirecting to dashboard...");
          // TODO: Replace with actual navigation
        }, 2000);
      } else {
        // Error state
        const newAttempts = otpState.attempts + 1;
        const maxAttempts = 5;

        if (newAttempts >= maxAttempts) {
          setOtpState((prev) => ({
            ...prev,
            isVerifying: false,
            error:
              "🚫 Too many failed attempts. Please wait 5 minutes or resend code.",
            attempts: newAttempts,
          }));
        } else {
          setOtpState((prev) => ({
            ...prev,
            isVerifying: false,
            error: "❌ Invalid code. Please try again.",
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
    }, 2000);
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (otpState.resendCooldown > 0 || otpState.isResending) return;

    setOtpState((prev) => ({ ...prev, isResending: true }));

    // TODO: Replace with actual API call
    console.log("Resending OTP to:", email);

    // Simulate API call
    setTimeout(() => {
      setOtpState((prev) => ({
        ...prev,
        isResending: false,
        timeRemaining: 300, // Reset to 5 minutes
        resendCooldown: 30, // Reset cooldown
        code: ["", "", "", "", "", ""], // Clear inputs
        error: null,
        attempts: 0, // Reset attempts
      }));

      // Focus first input
      inputRefs.current[0]?.focus();

      // Show success message briefly
      setOtpState((prev) => ({
        ...prev,
        error: "✅ New code sent successfully!",
      }));
      setTimeout(() => {
        setOtpState((prev) => ({ ...prev, error: null }));
      }, 3000);
    }, 2000);
  };

  // Determine input border color
  const getInputBorderColor = (index: number) => {
    if (otpState.success) return "border-green-500";
    if (otpState.error && otpState.error.includes("Invalid"))
      return "border-red-500";
    if (isCodeExpired) return "border-red-500";
    return "border-gray-300 focus:border-green-500";
  };

  return (
    <>
      <div className="flex w-full max-w-md flex-col gap-6 rounded-md border bg-white p-4 pb-8 shadow-sm lg:rounded-none lg:border-none lg:shadow-none">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Verify Your Email
          </h2>
          <p className="leading-7 text-gray-600">
            Enter the 6-digit code we sent to:
          </p>
          <p className="font-semibold text-blue-600">{email}</p>
        </div>

        {/* Success Animation */}
        {otpState.success && (
          <div className="animate-fade-in-scale flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-green-600">
                ✅ Email verified successfully!
              </p>
              <p className="text-sm text-gray-600">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {/* OTP Input Boxes */}
        {!otpState.success && (
          <>
            <div className="space-y-4">
              <label className="mb-8 text-sm font-semibold text-gray-900">
                Verification Code:
              </label>

              {/* 2 rows of 3 inputs each */}
              <div className="flex flex-col items-center gap-3">
                {/* Row 1 */}
                <div className="flex gap-3">
                  {[0, 1, 2].map((index) => (
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
                      className={`h-14 w-14 rounded-lg border-2 bg-white text-center text-2xl font-bold transition-colors duration-200 focus:ring-2 focus:ring-green-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 md:h-14 md:w-14 ${getInputBorderColor(index)} `}
                      disabled={otpState.isVerifying || otpState.success}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Row 2 */}
                <div className="flex gap-3">
                  {[3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpState.code[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`h-14 w-14 rounded-lg border-2 bg-white text-center text-2xl font-bold transition-colors duration-200 focus:ring-2 focus:ring-green-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 md:h-14 md:w-14 ${getInputBorderColor(index)} `}
                      disabled={otpState.isVerifying || otpState.success}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm font-medium">
                Code expires in:{" "}
                <span
                  className={`font-mono font-bold ${otpState.timeRemaining < 60 ? "text-red-600" : "text-orange-500"} `}
                >
                  {formatTime(otpState.timeRemaining)}
                </span>
              </p>

              {isCodeExpired && (
                <p className="mt-2 text-sm text-red-600">
                  Code expired. Click 'Resend Code' to get a new one.
                </p>
              )}
            </div>

            {/* Error Message */}
            {otpState.error && (
              <div className="text-center" aria-live="polite">
                <p
                  className={`text-sm font-medium ${
                    otpState.error.includes("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {otpState.error}
                </p>
                {otpState.attempts > 0 &&
                  otpState.attempts < 5 &&
                  !otpState.error.includes("✅") && (
                    <p className="mt-1 text-xs text-gray-500">
                      {5 - otpState.attempts} attempts remaining
                    </p>
                  )}
              </div>
            )}

            {/* Resend Code */}
            <div className="text-center">
              <p className="mb-2 text-sm text-gray-600">Didn't receive code?</p>
              <button
                onClick={handleResendCode}
                disabled={otpState.resendCooldown > 0 || otpState.isResending}
                className={`text-sm font-medium underline ${
                  otpState.resendCooldown > 0 || otpState.isResending
                    ? "cursor-not-allowed text-gray-400"
                    : "text-blue-600 hover:text-blue-700"
                } `}
                aria-disabled={
                  otpState.resendCooldown > 0 || otpState.isResending
                }
              >
                {otpState.isResending
                  ? "Sending new code..."
                  : otpState.resendCooldown > 0
                    ? `Resend Code (available in ${otpState.resendCooldown}s)`
                    : "Resend Code"}
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={
                !isCodeComplete ||
                otpState.isVerifying ||
                isCodeExpired ||
                otpState.attempts >= 5
              }
              className={`flex h-13 w-full items-center justify-center gap-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                isCodeComplete &&
                !otpState.isVerifying &&
                !isCodeExpired &&
                otpState.attempts < 5
                  ? "bg-green-600 hover:bg-green-700 active:bg-green-800"
                  : "cursor-not-allowed bg-gray-400"
              } `}
              aria-disabled={
                !isCodeComplete ||
                otpState.isVerifying ||
                isCodeExpired ||
                otpState.attempts >= 5
              }
            >
              {otpState.isVerifying ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>

            {/* Back Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Back to Registration
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
