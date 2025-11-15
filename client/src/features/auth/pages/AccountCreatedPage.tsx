import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";

interface LocationState {
  email?: string;
}

export const AccountCreatedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const email = state?.email;
  
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirect if no email provided
    if (!email) {
      navigate("/register");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/sign-in", {
            state: {
              message: "Please sign in with your credentials. Check your email to verify your account.",
              registeredEmail: email,
            },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  if (!email) return null;

  return (
    <div className="relative flex h-svh w-svw items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Theme Switcher - Top Right */}
      <div className="absolute right-4 top-4 z-10">
        <ThemeSwitcherMultiButton />
      </div>

      {/* Success Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Bridge Icon */}
        <div className="mb-6 flex justify-center">
          <BridgeIcon />
        </div>

        {/* Success Card */}
        <div className="rounded-lg border bg-card p-8 shadow-lg md:p-10">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <svg
                className="h-20 w-20 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Account Created Successfully
            </h2>
            <p className="text-muted-foreground">
              Redirecting to sign in in{" "}
              <span className="font-mono font-bold text-primary text-lg">{countdown}</span>{" "}
              {countdown === 1 ? "second" : "seconds"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
