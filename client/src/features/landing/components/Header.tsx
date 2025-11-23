import BridgeIcon from "@/components/bridge-icon";
import { AuthButtons } from "@/features/auth/components/AuthButtons";


export const Header = () => {
  return (
    <div className="bg-primary fixed z-50 flex w-full justify-between p-2 backdrop-blur-sm sm:px-8 lg:px-16">
      <div className="flex items-center text-center">
        <BridgeIcon variant="secondary" />
      </div>

      <AuthButtons
        reverse
        mainText="Sign in"
        mainPath="/sign-in"
        secondaryText="Get Started"
        secondaryPath="/register"
      />
    </div>
  );
};
