import * as React from "react";
import {
  LayoutDashboard,
  HelpCircle,
  Home,
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

export function ResidentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/resident">
                <Home className="h-5 w-5" />
                <span className="text-base font-semibold text-green-500">
                  bridge
                </span>
              </a>
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