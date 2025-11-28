import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  FileStack,
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
import BridgeIcon from "@/components/bridge-icon";
import { useAuth } from "@/features/auth/hooks/useAuth";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/staff",
    icon: LayoutDashboard,
  },
  {
    title: "Resident Management",
    url: "/staff/resident-management",
    icon: Users,
  },
  {
    title: "Document Requests",
    url: "/staff/doc-requests",
    icon: FileStack,
  },
];

const navSecondaryItems = [
  {
    title: "Settings",
    url: "/staff/settings",
    icon: Settings,
  },
  {
    title: "Get Help",
    url: "/staff/help",
    icon: HelpCircle,
  },
];

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuth();

  // Format user data for NavUser component
  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Staff User");

  const userEmail = user?.email || "staff@barangay.gov.ph";

  const userData = {
    name: userName,
    email: userEmail, // Use user's avatar if available, otherwise initials will be shown
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
              <BridgeIcon path="/staff" size="small" />
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
