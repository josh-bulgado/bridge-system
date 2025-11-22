import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useCreateDocument } from "../hooks";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

// Zod schema for document validation

export function AddDocumentSheet() {
  const [open, setOpen] = React.useState(false);
  const [requirements, setRequirements] = React.useState<string[]>([""]);
  const { mutate: createDocument, isPending } = useCreateDocument();

  // Use Form hook with correct type inference
  const form = useForm<AddDocumentFormValues>({
    resolver: zodResolver(addDocumentSchema), // Ensure schema is used with the correct types
    defaultValues: {
      name: "",
      price: 0,
      processingTime: "",
      status: "Active", // Default value for status
      requirements: [""], // Default to an empty requirement
    },
  });

  const { handleSubmit, setValue } = form;

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
    setValue("requirements", [...requirements, ""]);
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
    };

    // Call the create mutation
    createDocument(documentData, {
      onSuccess: () => {
        // Reset form after successful creation
        form.reset();
        setRequirements([""]);
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setRequirements([""]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm">
          <IconPlus className="h-4 w-4" />
          <span className="ml-2 hidden lg:inline">Add Document</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="justify-between overflow-y-auto sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Document</SheetTitle>
          <SheetDescription>
            Create a new document type for barangay services. Fill in all the
            required information.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex grow flex-col px-4"
          >
            <div className="grow space-y-2">
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
            </div>
            {/* Document Name */}

            <SheetFooter className="mt-auto gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Document</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default AddDocumentSheet;
