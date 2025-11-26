import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconFileText } from "@tabler/icons-react";
import { DocumentRequestForm } from "../components/DocumentRequestForm";
import { OrderSummary } from "../components/OrderSummary";
import type { Document } from "@/features/document/types/document";

const CreateDocumentRequestPage = () => {
  const location = useLocation();
  const preSelectedDocumentId = location.state?.preSelectedDocumentId;

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<"online" | "walkin">(
    "walkin",
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
          <IconFileText className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Request New Document
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to request a barangay document
          </p>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Form (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentRequestForm
                onDocumentSelect={setSelectedDocument}
                onPaymentMethodChange={setPaymentMethod}
                preSelectedDocumentId={preSelectedDocumentId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary (1/3 width on large screens, sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <OrderSummary
              selectedDocument={selectedDocument}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>

      {/* Mobile: Fixed bottom summary button */}
      <div className="bg-background fixed right-0 bottom-0 left-0 border-t p-4 lg:hidden">
        <Button className="w-full" size="lg">
          View Summary & Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateDocumentRequestPage;
