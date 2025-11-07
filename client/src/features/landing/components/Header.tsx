import BridgeIcon from "@/components/bridge-icon";
import AuthButtons from "@/features/auth/components/AuthButtons";

export const Header = () => {
  return (
    <div className="border-primary fixed z-50 flex w-full justify-between px-4 py-4 backdrop-blur-sm sm:px-8 lg:px-16">
      <div className="flex items-center text-center">
        <BridgeIcon />
      </div>

      <AuthButtons />
    </div>
  );
};
