import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash, IconFileUpload, IconX } from "@tabler/icons-react";
import { useUpdateDocument } from "../hooks";
import { useUploadDocument } from "@/hooks/useUploadFile";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Input } from "@/components/ui/input";
import {
  addDocumentSchema,
  type AddDocumentFormValues,
} from "../schema/addDocumentSchema";
import type { Document } from "../types/document";

interface EditDocumentSheetProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDocumentSheet({
  document,
  open,
  onOpenChange,
}: EditDocumentSheetProps) {
  const [requirements, setRequirements] = React.useState<string[]>(
    document.requirements,
  );
  const [templateFile, setTemplateFile] = React.useState<File | null>(null);
  const [isUploadingTemplate, setIsUploadingTemplate] = React.useState(false);
  
  const { mutate: updateDocument, isPending } = useUpdateDocument();
  const uploadMutation = useUploadDocument();

  // Use Form hook with correct type inference
  const form = useForm<AddDocumentFormValues>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      name: document.name,
      price: document.price,
      processingTime: document.processingTime,
      status: document.status,
      requirements: document.requirements,
      templateUrl: document.templateUrl,
    },
  });

  const { handleSubmit, setValue, reset } = form;

  // Reset form when document changes or sheet opens
  React.useEffect(() => {
    if (open) {
      reset({
        name: document.name,
        price: document.price,
        processingTime: document.processingTime,
        status: document.status,
        requirements: document.requirements,
        templateUrl: document.templateUrl,
      });
      setRequirements(document.requirements);
      setTemplateFile(null);
    }
  }, [document, open, reset]);

  const handleAddRequirement = () => {
    const newRequirements = [...requirements, ""];
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  // Handle template file selection
  const handleTemplateFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - only .docx
    if (!file.name.endsWith('.docx') && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast.error("Invalid file type", {
        description: "Please select a .docx file (Microsoft Word document)",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Template file must be less than 10MB",
      });
      return;
    }

    setIsUploadingTemplate(true);
    setTemplateFile(file);

    try {
      const result = await uploadMutation.mutateAsync({
        file,
        folder: "document-templates",
      });

      toast.success("Template uploaded", {
        description: "Document template has been uploaded successfully.",
      });

      setValue("templateUrl", result.url, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Failed to upload template",
      });
      setTemplateFile(null);
    } finally {
      setIsUploadingTemplate(false);
    }
  };

  // Remove template
  const handleRemoveTemplate = () => {
    setTemplateFile(null);
    // Keep the existing templateUrl in the form (don't clear it)
  };

  // On form submission
  const onSubmit = (data: AddDocumentFormValues) => {
    const filteredRequirements = data.requirements.filter(
      (req) => req.trim() !== "",
    );

    if (filteredRequirements.length === 0) {
      form.setError("requirements", {
        type: "manual",
        message: "At least one requirement is needed",
      });
      return;
    }

    const documentData = {
      name: data.name,
      price: data.price,
      processingTime: data.processingTime,
      status: data.status,
      requirements: filteredRequirements,
      templateUrl: data.templateUrl,
    };

    // Call the update mutation
    updateDocument(
      { id: document.id, data: documentData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="justify-between overflow-y-auto sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Document</SheetTitle>
          <SheetDescription>
            Update the document information. Make sure all required fields are
            filled in correctly.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex grow flex-col px-4"
          >
            <div className="grow space-y-2">
              {/* Document Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Barangay Clearance"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The official name of the document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (PHP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="1"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The fee for this document in Philippine Pesos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Processing Time */}
              <FormField
                control={form.control}
                name="processingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1-2 business days" {...field} />
                    </FormControl>
                    <FormDescription>
                      How long it takes to process this document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Whether this document is currently available for requests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements */}
              <FormField
                control={form.control}
                name="requirements"
                render={() => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <div className="space-y-2">
                      {requirements.map((requirement, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Requirement ${index + 1}`}
                            value={requirement}
                            onChange={(e) =>
                              handleRequirementChange(index, e.target.value)
                            }
                          />
                          {requirements.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemoveRequirement(index)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddRequirement}
                        className="w-full"
                      >
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Requirement
                      </Button>
                    </div>
                    <FormDescription>
                      Documents or information needed to request this document
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Template Upload */}
              <FormField
                control={form.control}
                name="templateUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Document Template *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {/* Current template info */}
                        {!templateFile && document.templateUrl && (
                          <div className="rounded-md border border-border bg-muted/50 p-3">
                            <div className="flex items-center gap-2">
                              <IconFileUpload className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">Current template</p>
                                <p className="text-xs text-muted-foreground">
                                  {document.templateUrl.split('/').pop()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Upload new template */}
                        {!templateFile ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="hidden"
                              {...form.register("templateUrl")}
                            />
                            <label
                              htmlFor="template-upload-edit"
                              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-muted-foreground/50"
                            >
                              <IconFileUpload className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {isUploadingTemplate
                                  ? "Uploading..."
                                  : "Click to upload new template"}
                              </span>
                              <input
                                id="template-upload-edit"
                                type="file"
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleTemplateFileSelect}
                                disabled={isUploadingTemplate}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between rounded-md border border-border bg-muted p-3">
                            <div className="flex items-center gap-2">
                              <IconFileUpload className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium">
                                  {templateFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(templateFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={handleRemoveTemplate}
                              disabled={isUploadingTemplate}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a new .docx template to replace the current one (max 10MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-auto gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Document"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default EditDocumentSheet;
