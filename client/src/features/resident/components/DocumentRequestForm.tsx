import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useFetchAvailableDocuments,
  useFetchGCashConfig,
  useCreateResidentDocumentRequest,
} from "../hooks";
import { GCashPaymentDialog } from "./GCashPaymentDialog";
import { ThankYouDialog } from "./ThankYouDialog";
import { MultiFileUploadZone } from "./MultiFileUploadZone";
import { PURPOSE_OPTIONS } from "../types/residentDocumentRequest";
import type { Document } from "@/features/document/types/document";
import { IconLoader2 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { toast } from "sonner";

const formSchema = z
  .object({
    documentId: z.string().min(1, "Please select a document type"),
    purpose: z.string().min(1, "Please select a purpose"),
    customPurpose: z.string().optional(),
    additionalDetails: z.string().optional(),
    paymentMethod: z.enum(["online", "walkin"]).optional(),
    documentFormat: z.enum(["hardcopy", "softcopy"]).optional(),
    paymentProof: z.string().optional(),
    supportingDocuments: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.purpose === "other" && !data.customPurpose) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify your purpose",
      path: ["customPurpose"],
    },
  )
  .refine(
    (data) => {
      // Require document format if payment method is online
      if (data.paymentMethod === "online" && !data.documentFormat) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a document format",
      path: ["documentFormat"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface DocumentRequestFormProps {
  onDocumentSelect: (document: Document | null) => void;
  onPaymentMethodChange: (method: "online" | "walkin") => void;
  onDocumentFormatChange?: (format: "hardcopy" | "softcopy" | undefined) => void;
  preSelectedDocumentId?: string;
}

export function DocumentRequestForm({
  onDocumentSelect,
  onPaymentMethodChange,
  onDocumentFormatChange,
  preSelectedDocumentId,
}: DocumentRequestFormProps) {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const { data: documents = [], isLoading: loadingDocuments } =
    useFetchAvailableDocuments();
  const { data: gcashConfig } = useFetchGCashConfig();
  const { mutate: createRequest, isPending } =
    useCreateResidentDocumentRequest();
  console.log("Available documents:", user);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [showCustomPurpose, setShowCustomPurpose] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [submittedTrackingNumber, setSubmittedTrackingNumber] =
    useState<string>("");
  const [submittedPaymentMethod, setSubmittedPaymentMethod] = useState<
    "online" | "walkin"
  >("walkin");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentId: preSelectedDocumentId || "",
      purpose: "",
      customPurpose: "",
      additionalDetails: "",
      paymentMethod: "walkin",
      documentFormat: undefined,
      paymentProof: "",
      supportingDocuments: [],
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  const documentFormat = form.watch("documentFormat");
  const purpose = form.watch("purpose");
  const documentId = form.watch("documentId");
  const supportingDocuments = form.watch("supportingDocuments");

  // Get selected document to check if it's free
  const selectedDocument = documents.find((d: Document) => d.id === documentId);
  const isFreeDocument = selectedDocument
    ? selectedDocument.price === 0
    : false;
  const hasRequirements = selectedDocument
    ? selectedDocument.requirements.length > 0
    : false;
  const needsSupportingDocs =
    hasRequirements &&
    (!supportingDocuments || supportingDocuments.length === 0);

  // Update parent when document selection changes
  useEffect(() => {
    const doc = documents.find((d: Document) => d.id === documentId);
    onDocumentSelect(doc || null);
    setSelectedDocumentId(documentId);
  }, [documentId, documents, onDocumentSelect]);

  // Update parent when payment method changes
  useEffect(() => {
    onPaymentMethodChange(paymentMethod);
  }, [paymentMethod, onPaymentMethodChange]);

  // Update parent when document format changes
  useEffect(() => {
    if (onDocumentFormatChange) {
      onDocumentFormatChange(documentFormat);
    }
  }, [documentFormat, onDocumentFormatChange]);

  // Show custom purpose field when "other" is selected
  useEffect(() => {
    setShowCustomPurpose(purpose === "other");
  }, [purpose]);

  // Auto-select document if preSelectedDocumentId is provided
  useEffect(() => {
    if (preSelectedDocumentId && documents.length > 0 && !loadingDocuments) {
      const docExists = documents.find((d: Document) => d.id === preSelectedDocumentId);
      if (docExists && form.getValues("documentId") !== preSelectedDocumentId) {
        // Use setTimeout to ensure the Select component is fully rendered
        setTimeout(() => {
          form.setValue("documentId", preSelectedDocumentId, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true 
          });
        }, 0);
      }
    }
  }, [preSelectedDocumentId, documents, loadingDocuments, form]);

  const handleFormSubmit = (values: FormValues) => {
    if (!user?.residentId) {
      toast.error("No resident ID found", {
        description:
          "Please make sure your profile is linked to a resident account.",
      });
      return;
    }

    // Validate supporting documents if document has requirements
    if (selectedDocument && selectedDocument.requirements.length > 0) {
      if (
        !values.supportingDocuments ||
        values.supportingDocuments.length === 0
      ) {
        toast.error("Supporting documents required", {
          description:
            "Please upload the required supporting documents before submitting.",
        });
        form.setError("supportingDocuments", {
          type: "manual",
          message: "Please upload the required supporting documents",
        });
        return;
      }
    }

    // For GCash payment, open the payment dialog
    if (!isFreeDocument && values.paymentMethod === "online") {
      setShowPaymentDialog(true);
      return;
    }

    // For cash on pickup or free documents, submit directly
    submitRequest(values);
  };

  const [submittedRequestId, setSubmittedRequestId] = useState<string>("");

  const submitRequest = (
    values: FormValues,
    referenceNumber?: string,
    receiptUrl?: string,
  ) => {
    if (!user?.residentId) return;

    const finalPurpose =
      values.purpose === "other" ? values.customPurpose! : values.purpose;

    // For free documents, default to walkin payment method
    const paymentMethod = isFreeDocument
      ? "walkin"
      : values.paymentMethod || "walkin";

    createRequest(
      {
        residentId: user.residentId,
        documentId: values.documentId,
        purpose: finalPurpose,
        additionalDetails: values.additionalDetails,
        paymentMethod: paymentMethod,
        documentFormat: values.documentFormat,
        paymentProof: receiptUrl || values.paymentProof,
        paymentReferenceNumber: referenceNumber,
        supportingDocuments: values.supportingDocuments,
      },
      {
        onSuccess: (data) => {
          setShowPaymentDialog(false);
          setSubmittedTrackingNumber(data.trackingNumber);
          setSubmittedRequestId(data.id);
          setSubmittedPaymentMethod(paymentMethod);
          setShowThankYouDialog(true);
        },
      },
    );
  };

  const handleSubmitAnother = () => {
    // Reset form to default values
    form.reset({
      documentId: "",
      purpose: "",
      customPurpose: "",
      additionalDetails: "",
      paymentMethod: "walkin",
      documentFormat: undefined,
      paymentProof: "",
      supportingDocuments: [],
    });
    
    // Reset local state
    setSelectedDocumentId("");
    setShowCustomPurpose(false);
    
    // Notify parent components
    onDocumentSelect(null);
    onPaymentMethodChange("walkin");
    if (onDocumentFormatChange) {
      onDocumentFormatChange(undefined);
    }
  };

  const handleConfirmPayment = (
    referenceNumber: string,
    receiptUrl: string,
  ) => {
    const values = form.getValues();
    // Store the receipt URL in the form
    form.setValue("paymentProof", receiptUrl);
    submitRequest(values, referenceNumber, receiptUrl);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          {/* Document Type Selection */}
          <FormField
            control={form.control}
            name="documentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingDocuments ? (
                      <SelectItem value="loading" disabled>
                        Loading documents...
                      </SelectItem>
                    ) : documents.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No documents available
                      </SelectItem>
                    ) : (
                      documents.map((doc: Document) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.name} -{" "}
                          {doc.price === 0 ? "FREE" : `₱${doc.price}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of document you want to request
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Only show remaining fields if a document is selected */}
          {selectedDocument && (
            <>
              <Separator />

              {/* Purpose Selection */}
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PURPOSE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Why do you need this document?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Purpose (shown when "other" is selected) */}
              {showCustomPurpose && (
                <FormField
                  control={form.control}
                  name="customPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please specify *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your specific purpose..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Additional Details */}
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide any additional information that may be helpful
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supporting Documents - Only show if document has requirements */}
              {selectedDocument && selectedDocument.requirements.length > 0 && (
                <>
                  <Separator />

                  <FormField
                    control={form.control}
                    name="supportingDocuments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supporting Documents *</FormLabel>
                        <FormControl>
                          <MultiFileUploadZone
                            onUploadComplete={(urls) => field.onChange(urls)}
                            maxFiles={5}
                            maxSize={10 * 1024 * 1024} // 10MB
                          />
                        </FormControl>
                        <FormDescription>
                          Upload the required documents listed in the order
                          summary (Images only: PNG, JPG, JPEG - max 5 files,
                          10MB each)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {!isFreeDocument && (
                <>
                  <Separator />

                  {/* Payment Method */}
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-y-0 space-x-3">
                              <RadioGroupItem value="online" id="online" />
                              <Label className="font-normal" htmlFor="online">
                                GCash (Pay Now)
                              </Label>
                            </div>
                            <div className="flex items-center space-y-0 space-x-3">
                              <RadioGroupItem value="walkin" id="walkin" />
                              <Label className="font-normal" htmlFor="walkin">
                                Cash on Pickup (Pay at Barangay Hall)
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Document Format - Only show when GCash is selected */}
                  {paymentMethod === "online" && (
                    <FormField
                      control={form.control}
                      name="documentFormat"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Document Format *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-y-0 space-x-3">
                                <RadioGroupItem value="hardcopy" id="hardcopy" />
                                <Label className="font-normal" htmlFor="hardcopy">
                                  Hard Copy (To be picked up at Barangay Hall)
                                </Label>
                              </div>
                              <div className="flex items-center space-y-0 space-x-3">
                                <RadioGroupItem value="softcopy" id="softcopy" />
                                <Label className="font-normal" htmlFor="softcopy">
                                  Soft Copy (PDF - Digital delivery)
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            Choose how you want to receive your document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />
                </>
              )}
            </>
          )}

          {/* Submit Button - Only show if document is selected */}
          {selectedDocument && (
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !form.watch("purpose") ||
                  needsSupportingDocs
                }
              >
                {isPending && (
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!isFreeDocument && paymentMethod === "online"
                  ? "Pay Now"
                  : "Submit Request"}
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* GCash Payment Dialog */}
      <GCashPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        gcashConfig={gcashConfig}
        documentPrice={selectedDocument?.price || 0}
        onConfirmPayment={handleConfirmPayment}
        isPending={isPending}
      />

      {/* Thank You Dialog */}
      <ThankYouDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
        trackingNumber={submittedTrackingNumber}
        paymentMethod={submittedPaymentMethod}
        onSubmitAnother={handleSubmitAnother}
        requestId={submittedRequestId}
      />
    </>
  );
}
