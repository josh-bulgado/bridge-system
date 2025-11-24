import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { VerifyOTPForm } from "../components";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import BridgeIcon from "@/components/bridge-icon";

// TypeScript Interfaces
interface LocationState {
  email?: string;
  message?: string;
}

export const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const email = state?.email;

  // Redirect to sign-in if no email is provided
  useEffect(() => {
    if (!email) {
      navigate("/sign-in", {
        replace: true
      });
    }
  }, [email, navigate]);
  
  return (
    <div className="flex h-svh w-svw flex-col items-center justify-center p-4 gap-6">
      <ThemeSwitcherMultiButton />
      <BridgeIcon />

      <VerifyOTPForm email={email} />
    </div>
  );
};

export default VerifyOTPPage;
