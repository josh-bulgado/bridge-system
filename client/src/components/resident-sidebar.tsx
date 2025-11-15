import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  Search,
  Settings,
  Users,
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
import BridgeIcon from "./bridge-icon";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/resident",
    icon: LayoutDashboard,
  },
  {
    title: "Community",
    url: "/resident/community",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/resident/reports",
    icon: FileText,
  },
];

const navSecondaryItems = [
  {
    title: "Settings",
    url: "/resident/settings",
    icon: Settings,
  },
  {
    title: "Get Help",
    url: "/resident/help",
    icon: HelpCircle,
  },
  {
    title: "Search",
    url: "/resident/search",
    icon: Search,
  },
];

export function ResidentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuth();

  // Format user data for NavUser component
  const userName = user?.fullName || 
    (user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : "Resident User");

  const userEmail = user?.email || "resident@example.com";

  const userData = {
    name: userName,
    email: userEmail,
    avatar: "/avatars/resident.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <BridgeIcon path="/resident" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
