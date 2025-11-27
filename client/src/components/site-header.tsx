/* eslint-disable @typescript-eslint/no-unused-vars */
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationCenter } from "./notification-center";
import { SearchModal } from "./search-modal";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { Fragment, useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";

// Route label mapping for better breadcrumb display
const routeLabels: Record<string, string> = {
  // Resident routes
  resident: "Dashboard",
  requests: "My Requests",
  new: "New Request",
  verification: "Verification",
  verify: "Verification",
  community: "Community",
  reports: "Reports",
  help: "Help",
  search: "Search",
  
  // Staff routes
  staff: "Dashboard",
  residents: "Residents",
  "document-requests": "Document Requests",
  "payment-verification": "Payment Verification",
  "document-generation": "Document Generation",
  "staff-management": "Staff Management",
  
  // Admin routes
  admin: "Dashboard",
  documents: "Document Management",
  users: "User Management",
  settings: "Settings",
  "barangay-config": "Barangay Configuration",
  
  // Common
  dashboard: "Dashboard",
  management: "Management",
};

// Helper function to convert kebab-case/snake_case to Title Case
const formatSegment = (segment: string): string => {
  // Check if we have a custom label first
  if (routeLabels[segment]) {
    return routeLabels[segment];
  }
  
  // Otherwise, format the segment nicely
  return segment
    .split(/[-_]/) // Split on dash or underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function SiteHeader() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Generate breadcrumb items from current path
  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const crumbs: { label: string; href: string; isLast: boolean }[] = [];
    let hasDetailPage = false;

    // Build breadcrumb trail
    pathSegments.forEach((segment, index) => {
      // Check if this is a MongoDB ID (detail page)
      const isMongoId = segment.length === 24 || /^[0-9a-f]{24}$/i.test(segment);
      
      if (isMongoId) {
        hasDetailPage = true;
        return; // Skip the ID itself
      }

      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = formatSegment(segment);
      const isLast = index === pathSegments.length - 1 && !hasDetailPage;

      crumbs.push({ label, href, isLast });
    });

    // If we skipped a MongoDB ID, add a generic "Details" breadcrumb
    if (hasDetailPage) {
      const lastCrumb = crumbs[crumbs.length - 1];
      if (lastCrumb) {
        lastCrumb.isLast = false; // Previous crumb is no longer last
      }
      
      // Determine detail page label based on context
      let detailLabel = "Details";
      if (location.pathname.includes("/requests/")) {
        detailLabel = "Request Details";
      } else if (location.pathname.includes("/residents/")) {
        detailLabel = "Resident Details";
      } else if (location.pathname.includes("/staff/")) {
        detailLabel = "Staff Details";
      } else if (location.pathname.includes("/documents/")) {
        detailLabel = "Document Details";
      }
      
      crumbs.push({ 
        label: detailLabel, 
        href: location.pathname, 
        isLast: true 
      });
    }

    return crumbs;
  }, [location.pathname]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        
        {/* Dynamic Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, _index) => (
                <Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="text-base font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href} className="text-sm">
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="relative"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <NotificationCenter />
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
