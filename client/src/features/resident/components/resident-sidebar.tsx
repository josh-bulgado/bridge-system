import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import BridgeIcon from "../../../components/bridge-icon";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/resident",
    icon: LayoutDashboard,
  },
  {
    title: "My Requests",
    url: "/resident/requests",
    icon: ClipboardList,
  },
  {
    title: "New Request",
    url: "/resident/new-requests",
    icon: FilePlus,
  },
];

const navSecondaryItems = [
  {
    title: "Help & Support",
    url: "/resident/help",
    icon: MessageSquare,
  },
];

export function ResidentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuth();
  // Removed: Don't log user data

  // Format user data for NavUser component
  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Resident User");

  const userEmail = user?.email || "user@example.com";

  const userData = {
    name: userName,
    email: userEmail,
    avatar: user?.avatar, // Use user's avatar if available, otherwise initials will be shown
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      style={{
        willChange: "width",
        ...props.style,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <BridgeIcon path="/resident" size="small" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="will-change-auto">
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
