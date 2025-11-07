import { Link } from "react-router-dom";

const bridgeVariantStyles = {
  default: "text-2xl sm:text-3xl lg:text-4xl",
  compact: "text-lg sm:text-xl lg:text-2xl",
};

interface BridgeIconProps {
  path?: string;
  variant?: "default" | "compact";
}

const BridgeIcon = ({ path, variant = "default" }: BridgeIconProps) => {
  return (
    <Link
      to={path || "/"}
      className="text-primary text-2xl font-extrabold tracking-tight text-balance sm:text-3xl lg:text-4xl"
    >
      bridge
    </Link>
  );
};

export default BridgeIcon;
