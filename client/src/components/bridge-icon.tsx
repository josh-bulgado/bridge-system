import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

const bridgeIconVariants = cva(
  "font-extrabold tracking-tight transition-all duration-300 ease-in-out inline-block",
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
  // Try to get sidebar state, but handle cases where we're not in a SidebarProvider
  let isCollapsed = false;
  try {
    const { state } = useSidebar();
    isCollapsed = state === "collapsed";
  } catch {
    // Not inside a SidebarProvider, use default behavior
    isCollapsed = false;
  }
  
  // Show only "b" when sidebar is collapsed (icon mode), otherwise show full text or based on version prop
  const displayText = isCollapsed ? "b" : (version === "full" ? "bridge" : "b");

  return (
    <Link
      to={path}
      className={bridgeIconVariants({ variant, size, responsive, version })}
      style={{
        minWidth: isCollapsed ? "auto" : "fit-content",
        whiteSpace: "nowrap",
      }}
    >
      {displayText}
    </Link>
  );
};

export default BridgeIcon;
