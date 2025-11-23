import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Phone, Mail, MapPin } from "lucide-react";

export const OfficeInfoCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangay Office Information</CardTitle>
        <CardDescription>
          Contact us or visit during office hours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Office Hours */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Office Hours</span>
          </div>
          <div className="ml-6 space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span className="font-medium">8:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-medium">8:00 AM - 12:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday & Holidays</span>
              <span className="font-medium text-red-500">Closed</span>
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>Contact Number</span>
          </div>
          <div className="ml-6 text-sm text-muted-foreground">
            <a href="tel:+1234567890" className="hover:text-primary hover:underline">
              (123) 456-7890
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>Email Address</span>
          </div>
          <div className="ml-6 text-sm text-muted-foreground">
            <a href="mailto:contact@barangay.gov.ph" className="hover:text-primary hover:underline">
              contact@barangay.gov.ph
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Office Address</span>
          </div>
          <div className="ml-6 text-sm text-muted-foreground">
            Barangay Hall, Main Street<br />
            City, Province 1234
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
