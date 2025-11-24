import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  Search,
  Users,
  FilePlus,
  ListChecks,
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
    icon: ListChecks,
  },
  {
    title: "Request Document",
    url: "/resident/requests/new",
    icon: FilePlus,
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
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
