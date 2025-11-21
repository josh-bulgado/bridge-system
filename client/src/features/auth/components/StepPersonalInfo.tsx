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

      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1 h-5">
                  First Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Juan" className="h-10" autoFocus />
                </FormControl>
                <div className="h-5 text-sm">
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
                <FormLabel className="flex items-center gap-1 h-5">
                  Middle Name
                  <Badge variant="secondary" className="text-xs">
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
                        /[^a-zA-Z\s]/g,
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
                <div className="h-5 text-sm">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-1 h-5">
                  Last Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Dela Cruz" className="h-10" />
                </FormControl>
                <div className="h-5 text-sm">
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
                <FormLabel className="flex items-center gap-1 h-5">
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
                <div className="h-5 text-sm">
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
              <FormLabel className="flex items-center gap-1 h-5">
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
              <div className="h-5 text-sm">
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
