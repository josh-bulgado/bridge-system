import * as React from "react";
import {
  IconSettings,
  IconHelp,
  IconDashboard,
  IconFileText,
  IconCreditCard,
  IconDownload,
  IconChartBar,
  IconInnerShadowTop,
} from "@tabler/icons-react";

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
import { LayoutDashboard, Users } from "lucide-react";

const staffData = {
  user: {
    name: "Staff User",
    email: "staff@barangay.gov.ph",
    avatar: "/avatars/staff.jpg",
  },
  navMain: [
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
      title: "All Requests",
      url: "/staff/requests",
      icon: IconFileText,
    },
    {
      title: "Payment Verification",
      url: "/staff/payment-verification",
      icon: IconCreditCard,
    },
    {
      title: "Document Generation",
      url: "/staff/document-generation",
      icon: IconDownload,
    },
    {
      title: "Reports",
      url: "/staff/reports",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/staff/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/staff/help",
      icon: IconHelp,
    },
  ],
};

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/staff">
                <IconInnerShadowTop size={5} />
                <span className="text-base font-semibold text-green-500">
                  Barangay Portal
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staffData.navMain} />
        <NavSecondary items={staffData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={staffData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
