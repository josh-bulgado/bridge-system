import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useFetchBarangayConfig } from "@/features/admin/hooks/useFetchBarangayConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const OfficeInfoBanner: React.FC = () => {
  const { data: config, isLoading } = useFetchBarangayConfig();
  const [isOpen, setIsOpen] = useState(false);

  const isOfficeOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
  };

  const officeIsOpen = isOfficeOpen();

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-lg" />;
  }

  if (!config) return null;

  return (
    <>
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Office Info */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-green-100 dark:bg-green-950 p-3">
                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base">Barangay Office</h3>
                  <Badge
                    variant={officeIsOpen ? "default" : "secondary"}
                    className={cn(
                      officeIsOpen
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    )}
                  >
                    {officeIsOpen ? "Open Now" : "Closed"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <a
                    href={`tel:${config.contact.phone}`}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{config.contact.phone}</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">Brgy. {config.address.barangayName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: View Details Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="shrink-0"
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Details Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Barangay Office Information
              <Badge
                variant={officeIsOpen ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  officeIsOpen
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {officeIsOpen ? "Open Now" : "Closed"}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Contact information and office hours
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Office Hours */}
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-950 p-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Office Hours</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {config.officeHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {/* Phone */}
              <a
                href={`tel:${config.contact.phone}`}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted group"
              >
                <div className="rounded-full bg-green-100 dark:bg-green-950 p-2">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium group-hover:text-green-600">
                    {config.contact.phone}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${config.contact.email}`}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted group"
              >
                <div className="rounded-full bg-purple-100 dark:bg-purple-950 p-2">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium group-hover:text-purple-600 truncate">
                    {config.contact.email}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </a>

              {/* Address */}
              <div className="flex items-start gap-3 rounded-lg p-3 bg-muted/30">
                <div className="rounded-full bg-red-100 dark:bg-red-950 p-2 shrink-0">
                  <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-sm font-medium">
                    Barangay {config.address.barangayName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {config.address.municipalityName},{" "}
                    {config.address.provinceName}
                    <br />
                    {config.address.regionName}
                  </p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                const address = `Barangay ${config.address.barangayName}, ${config.address.municipalityName}, ${config.address.provinceName}`;
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
                  "_blank"
                );
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
