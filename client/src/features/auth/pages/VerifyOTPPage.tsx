import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";
import { VerifyOTPForm } from "../components";

// TypeScript Interfaces
interface LocationState {
  email?: string;
  message?: string;
}

export const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const email = state?.email || "agentbea12@gmail.com";

  // Redirect to email-confirmation if no email is provided (but allow fallback email for testing)
  useEffect(() => {
    if (!state?.email) {
      console.log("No email provided, using fallback email for development");
      // In production, you might want to uncomment the redirect below
      // navigate("/email-confirmation", {
      //   state: {
      //     message: "Please confirm your email to proceed with verification."
      //   }
      // });
    }
  }, [state, navigate]);
  
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center p-4 gap-6">
      <ThemeSwitcherMultiButton />
      <BridgeIcon />

      <VerifyOTPForm email={email} />
    </div>
  );
};

export default VerifyOTPPage;
