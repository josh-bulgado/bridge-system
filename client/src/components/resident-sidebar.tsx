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

const residentData = {
  user: {
    name: "Resident User",
    email: "resident@example.com",
    avatar: "/avatars/resident.jpg",
  },
  navMain: [
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
  ],
  navSecondary: [
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
  ],
};

export function ResidentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
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
      <SidebarContent>
        <NavMain items={residentData.navMain} />
        <NavSecondary items={residentData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={residentData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
