import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTypes, useDocumentRequests } from "../hooks/useDocumentRequests";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";

const NewRequestPage = () => {
  const navigate = useNavigate();
  const { documentTypes, isLoading: isLoadingTypes } = useDocumentTypes();
  const { createRequest, isCreating } = useDocumentRequests();

  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedType = documentTypes?.find((dt) => dt.name === selectedDocumentType);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedDocumentType) {
      newErrors.documentType = "Please select a document type";
    }

    if (!purpose || purpose.length < 10) {
      newErrors.purpose = "Purpose must be at least 10 characters";
    }

    if (quantity < 1 || quantity > 10) {
      newErrors.quantity = "Quantity must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createRequest({
        documentType: selectedDocumentType,
        purpose,
        quantity,
      });
      navigate("/resident");
    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  if (isLoadingTypes) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/resident")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Document Request</h1>
          <p className="mt-1 text-gray-600">
            Submit a request for barangay documents
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Fill in the information below to submit your request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="documentType">
                Document Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDocumentType}
                onValueChange={setSelectedDocumentType}
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-sm text-red-500">{errors.documentType}</p>
              )}
            </div>

            {/* Document Type Details */}
            {selectedType && (
              <Alert>
                <FileText className="h-4 w-4" />
                <div className="ml-2">
                  <p className="font-semibold">{selectedType.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedType.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Price:</span> ₱
                      {selectedType.basePrice.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-semibold">Processing Time:</span>{" "}
                      {selectedType.processingTime} days
                    </div>
                  </div>
                  {selectedType.requiredDocuments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold">Required Documents:</p>
                      <ul className="ml-4 list-disc text-sm text-gray-600">
                        {selectedType.requiredDocuments.map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Alert>
            )}

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">
                Purpose <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="purpose"
                placeholder="Please specify the purpose of this document request (minimum 10 characters)"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
                className={errors.purpose ? "border-red-500" : ""}
              />
              {errors.purpose && (
                <p className="text-sm text-red-500">{errors.purpose}</p>
              )}
              <p className="text-sm text-gray-500">
                {purpose.length}/10 characters minimum
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className={errors.quantity ? "border-red-500" : ""}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
              {selectedType && quantity > 1 && (
                <p className="text-sm text-gray-600">
                  Total: ₱{(selectedType.basePrice * quantity).toFixed(2)}
                </p>
              )}
            </div>

            {/* Verification Warning */}
            {selectedType?.requiresVerification && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <div className="ml-2">
                  <p className="text-sm">
                    This document type requires resident verification. Make sure
                    your residency has been verified before submitting.
                  </p>
                </div>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner className="mr-2" size="sm" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/resident")}
                disabled={isCreating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default NewRequestPage;
