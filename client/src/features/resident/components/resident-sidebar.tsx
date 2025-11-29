import { LayoutDashboard, FilePlus, ClipboardList } from "lucide-react";

import { NavMain } from "@/components/nav-main";
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
import { useFetchResidentById } from "@/features/staff/hooks";

const navMainItems = [
  {
    title: "Dashboard",
    url: "/resident",
    icon: LayoutDashboard,
    requiresVerification: false, // Dashboard is always accessible
  },
  {
    title: "My Requests",
    url: "/resident/requests",
    icon: ClipboardList,
    requiresVerification: true, // Requires verification
  },
  {
    title: "New Request",
    url: "/resident/new-requests",
    icon: FilePlus,
    requiresVerification: true, // Requires verification
  },
];

export function ResidentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuth();

  const { data: residentData } = useFetchResidentById(user?.residentId || "");

  const isVerified = residentData?.verificationStatus === "Approved" || false;

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
              <BridgeIcon path="/resident" size="small" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="will-change-auto">
        <NavMain items={navMainItems} isVerified={isVerified} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
