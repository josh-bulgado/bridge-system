import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DateColumnPicker } from "@/components/date-column-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";
import { formatLocalDate } from "@/lib/date";

const StepPersonalInfo = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-muted-foreground text-sm">
          Please enter your personal details accurately.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name Fields Row 1 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  First Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Juan" className="h-10" autoFocus />
                </FormControl>
                <div className="min-h-[20px] text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="middleName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  Middle Name
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                    Optional
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Santos"
                    className="h-10"
                    onInput={(e) => {
                      // Only allow letters and spaces, capitalize first letter
                      let value = e.currentTarget.value.replace(
                        /[^a-zA-Z\\s]/g,
                        "",
                      );
                      value =
                        value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase();
                      e.currentTarget.value = value;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <div className="min-h-[20px] text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Name Fields Row 2 */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1fr_120px]">
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  Last Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Dela Cruz" className="h-10" />
                </FormControl>
                <div className="min-h-[20px] text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="extensionName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                  Extension
                </FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : value)
                  }
                  defaultValue={field.value}
                  value={field.value ?? "none"}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="jr">Jr.</SelectItem>
                    <SelectItem value="sr">Sr.</SelectItem>
                    <SelectItem value="ii">II</SelectItem>
                    <SelectItem value="iii">III</SelectItem>
                    <SelectItem value="iv">IV</SelectItem>
                  </SelectContent>
                </Select>
                <div className="min-h-[20px] text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Date of Birth Section */}
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                Date of Birth
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <DateColumnPicker
                  value={field.value ? new Date(field.value) : undefined}
                  onDateChange={(date) => {
                    field.onChange(formatLocalDate(date));
                  }}
                />
              </FormControl>
              <div className="min-h-[20px] text-sm">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default StepPersonalInfo;
