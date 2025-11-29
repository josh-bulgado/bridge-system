import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    requiresVerification?: boolean;
  }[];
  isVerified?: boolean;
}

export function NavMain({ items, isVerified }: NavMainProps) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;
            // Disable item only if it requires verification and user is not verified
            const isDisabled = item.requiresVerification && !isVerified;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  disabled={isDisabled}
                  tooltip={isDisabled ? `${item.title} (Verification required)` : item.title}
                  asChild
                  className={
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : isDisabled 
                      ? "opacity-50 cursor-not-allowed text-muted-foreground" 
                      : ""
                  }
                >
                  <Link to={item.url} className={isDisabled ? "pointer-events-none" : ""}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
