import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type VerificationFormData } from "../schemas/verificationSchema";

interface AddressInformationSectionProps {
  form: UseFormReturn<VerificationFormData>;
}

export const AddressInformationSection = ({
  form,
}: AddressInformationSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Address Information</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
  );
};
