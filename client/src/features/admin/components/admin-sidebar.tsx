import * as React from "react";

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
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Settings,
  HelpCircle,
  Search,
  FolderOpen,
  Building2,
} from "lucide-react";
import BridgeIcon from "@/components/bridge-icon";

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
      icon: LayoutDashboard,
    },
    {
      title: "Resident Management",
      url: "/admin/resident-management",
      icon: Users,
    },
    {
      title: "Staff Management",
      url: "/admin/staff-management",
      icon: UserCog,
    },
    {
      title: "Document Requests",
      url: "/admin/doc-requests",
      icon: UserCog,
    },
    {
      title: "Document Configuration",
      url: "/admin/config/document",
      icon: FileText,
    },
    {
      title: "Barangay Configuration",
      url: "/admin/config/barangay",
      icon: Building2,
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
      icon: FolderOpen,
    },
  ],
};

export const AdminSidebar = React.memo(function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
              <BridgeIcon path="/admin" size="small" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="will-change-auto">
        <NavMain items={adminData.navMain} />
        <NavSecondary items={adminData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
    </Sidebar>
  );
});
