import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
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
import {
  UserCheck,
  Users,
  Settings2,
  Settings,
  HelpCircle,
  Search,
  Database,
  Home,
} from "lucide-react";
import { IconInnerShadowTop } from "@tabler/icons-react";

const adminData = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Resident Management",
      url: "/admin/residents",
      icon: Users,
    },
    {
      title: "Staff Management",
      url: "/admin/staff",
      icon: UserCheck,
    },
    {
      title: "Document Configuration",
      url: "/admin/config/document",
      icon: Settings2,
    },
    // {
    //   title: "Analytics",
    //   url: "/admin/analytics",
    //   icon: IconChartBar,
    // },
    {
      title: "Barangay Configuration",
      url: "/admin/config/barangay",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "/admin/search",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/admin/data-library",
      icon: Database,
    },
  ],
};

export function AdminSidebar({
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
              <a href="/admin">
                <IconInnerShadowTop size={5} />
                <span className="text-primary text-base font-semibold">
                  bridge
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavDocuments items={adminData.documents} />
        <NavSecondary items={adminData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
