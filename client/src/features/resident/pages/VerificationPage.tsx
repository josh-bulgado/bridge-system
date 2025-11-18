import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ShieldCheck,
  Upload,
  FileImage,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

// Zod schema for verification form
const verificationSchema = z.object({
  streetPurok: z.string().min(1, "Street/Purok is required"),
  houseNumberUnit: z.string().min(1, "House number/unit is required"),
  governmentIdFront: z
    .instanceof(File, { message: "Government ID front is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPEG, PNG files are allowed",
    ),
  governmentIdBack: z
    .instanceof(File, { message: "Government ID back is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPEG, PNG files are allowed",
    ),
  proofOfResidency: z
    .instanceof(File, { message: "Proof of residency is required" })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
          file.type,
        ),
      "Only JPEG, PNG, PDF files are allowed",
    ),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const VerificationPage = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      streetPurok: "",
      houseNumberUnit: "",
    },
  });

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement verification submission logic
      console.log("Verification submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag and drop file upload component
  const DragDropFileUpload = ({
    field,
    label,
    description,
    accept = "image/*",
    onChange,
  }: {
    field: any;
    label: string;
    description: string;
    accept?: string;
    onChange: (file: File | undefined) => void;
  }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          onChange(acceptedFiles[0]);
        }
      },
      accept: accept === "image/*,application/pdf" 
        ? { 'image/*': [], 'application/pdf': [] }
        : { 'image/*': [] },
      maxFiles: 1,
      multiple: false,
    });

    const removeFile = () => {
      onChange(undefined);
    };

    return (
      <div className="space-y-2">
        <FormLabel>{label}</FormLabel>
        <p className="text-sm text-gray-600">{description}</p>

        <div
          {...getRootProps()}
          className={cn(
            "rounded-lg border-2 border-dashed p-4 text-center transition-colors cursor-pointer",
            isDragActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:border-gray-400"
          )}
        >
          <input {...getInputProps()} />

          {field.value ? (
            <div className="space-y-2">
              <FileImage className="mx-auto h-8 w-8 text-green-600" />
              <p className="text-sm font-medium text-green-600">
                ✓ {field.value.name}
              </p>
              <p className="text-xs text-gray-500">
                {(field.value.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Upload className="mr-1 h-3 w-3" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="mr-1 h-3 w-3" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isDragActive ? (
                <>
                  <Upload className="mx-auto h-8 w-8 text-orange-600 animate-bounce" />
                  <p className="text-sm font-medium text-orange-600">
                    Drop file here...
                  </p>
                </>
              ) : (
                <>
                  <FileImage className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium">
                    Drag and drop file here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">Max size: 5MB</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex h-svh flex-col justify-center space-y-6 px-4 lg:px-6">
        <div className="mx-auto flex max-w-2xl">
          <div className="h space-y-4 py-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h3 className="text-xl font-semibold text-green-800">
              Verification Submitted!
            </h3>
            <p className="text-gray-600">
              Your verification request has been submitted successfully. You
              will receive a notification once your account is verified.
            </p>
            <Button onClick={() => navigate("/resident")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/resident")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
            Verify Your Residency
          </h1>
          <p className="mt-2 text-gray-600">
            Complete the verification process to access all barangay services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verification Form</CardTitle>
            <CardDescription>
              Please provide your address details and upload required documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="houseNumberUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>House Number/Unit</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 123, Apt 4B, Unit 5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streetPurok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street/Purok</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Rizal Street, Purok 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Required Documents</h3>

                  {/* Government ID Front */}
                  <FormField
                    control={form.control}
                    name="governmentIdFront"
                    render={({ field }) => (
                      <FormItem>
                        <DragDropFileUpload
                          field={field}
                          label="Government ID (Front Side)"
                          description="Upload a clear photo of the front side of your valid government ID"
                          accept="image/*"
                          onChange={(file) => field.onChange(file)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Government ID Back */}
                  <FormField
                    control={form.control}
                    name="governmentIdBack"
                    render={({ field }) => (
                      <FormItem>
                        <DragDropFileUpload
                          field={field}
                          label="Government ID (Back Side)"
                          description="Upload a clear photo of the back side of your valid government ID"
                          accept="image/*"
                          onChange={(file) => field.onChange(file)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Proof of Residency */}
                  <FormField
                    control={form.control}
                    name="proofOfResidency"
                    render={({ field }) => (
                      <FormItem>
                        <DragDropFileUpload
                          field={field}
                          label="Proof of Residency"
                          description="Upload any document showing your current address (Utility Bill, Lease Contract, Certificate of Residency, etc.)"
                          accept="image/*,application/pdf"
                          onChange={(file) => field.onChange(file)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Information Note */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your verification request will be
                    reviewed by barangay staff. You will receive a notification
                    once your account is verified (usually within 1-3 business
                    days).
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Verification"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
