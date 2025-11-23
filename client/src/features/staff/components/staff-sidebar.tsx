import * as React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Download,
  BarChart3,
  Settings,
  HelpCircle,
  Building2,
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
      title: "Document Requests",
      url: "/staff/doc-requests",
      icon: FileText,
    },
    {
      title: "Payment Verification",
      url: "/staff/payment-verification",
      icon: CreditCard,
    },
    {
      title: "Document Generation",
      url: "/staff/document-generation",
      icon: Download,
    },
    {
      title: "Reports",
      url: "/staff/reports",
      icon: BarChart3,
    },
  ],
  navSecondary: [
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
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/staff">
                <Building2 className="size-5" />
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
