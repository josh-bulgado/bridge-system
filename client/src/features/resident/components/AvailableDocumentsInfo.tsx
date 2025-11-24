import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, DollarSign } from "lucide-react";

interface DocumentType {
  name: string;
  description: string;
  processingTime: string;
  fee: string;
}

export const AvailableDocumentsInfo: React.FC = () => {
  const documentTypes: DocumentType[] = [
    {
      name: "Barangay Clearance",
      description: "Certificate of good moral character and residency",
      processingTime: "1-2 days",
      fee: "₱50.00",
    },
    {
      name: "Certificate of Residency",
      description: "Proof of residence in the barangay",
      processingTime: "Same day",
      fee: "₱30.00",
    },
    {
      name: "Certificate of Indigency",
      description: "Certificate for low-income residents",
      processingTime: "2-3 days",
      fee: "Free",
    },
    {
      name: "Business Permit",
      description: "Permit for small business operations",
      processingTime: "3-5 days",
      fee: "₱100.00",
    },
    {
      name: "Barangay ID",
      description: "Official barangay identification card",
      processingTime: "5-7 days",
      fee: "₱100.00",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Documents</CardTitle>
        <CardDescription>
          Documents you can request once your residency is verified
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documentTypes.map((doc, index) => (
            <div
              key={index}
              className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{doc.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doc.description}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{doc.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>{doc.fee}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="whitespace-nowrap">
                  Requires Verification
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
