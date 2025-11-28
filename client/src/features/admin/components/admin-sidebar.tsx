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
  Building2,
  FileStack,
} from "lucide-react";
import BridgeIcon from "@/components/bridge-icon";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navMainItems = [
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
    icon: FileStack,
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
];

const navSecondaryItems = [
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
];

export const AdminSidebar = React.memo(function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuth();

  // Format user data for NavUser component
  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Admin User");

  const userEmail = user?.email || "admin@example.com";

  const userData = {
    name: userName,
    email: userEmail,
    // Use user's avatar if available, otherwise initials will be shown
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
              <BridgeIcon path="/admin" size="small" />
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
});
