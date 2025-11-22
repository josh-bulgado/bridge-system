import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";

const bridgeIconVariants = cva(
  "font-extrabold tracking-tight transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted",
      },
      size: {
        default: "text-2xl sm:text-3xl lg:text-4xl",
        compact: "text-4xl sm:text-4xl lg:text-4xl",
        small: "text-4xl sm:text-4xl lg:text-4xl",
      },
      responsive: {
        showOnLg: "block lg:block",
        hideOnLg: "block lg:hidden", // hidden on lg and above
      },
      version: {
        full: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      responsive: "showOnLg",
      version: "full",
    },
  },
);

export interface BridgeIconProps
  extends VariantProps<typeof bridgeIconVariants> {
  path?: string;
}

const BridgeIcon = ({
  path = "/",
  variant,
  size,
  responsive,
  version = "full",
}: BridgeIconProps) => {
  const displayText = version === "full" ? "bridge" : "b";

  return (
    <Link
      to={path}
      className={bridgeIconVariants({ variant, size, responsive, version })}
    >
      {displayText}
    </Link>
  );
};

export default BridgeIcon;
