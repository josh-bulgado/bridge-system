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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatLocalDate } from "@/lib/date";

const StepPersonalInfo = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Name Fields */}
        <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex h-6 items-center gap-1">
                  First Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Juan" className="h-9" />
                </FormControl>
                <FormMessage />
                <div className="h-5"></div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex h-6 items-center gap-1 bg-red500">
                  Middle Name
                  <Badge variant="secondary" className="ml-1 text-xs">
                    Optional
                  </Badge>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Santos"
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
                <FormMessage />
                <div className="h-5"></div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex h-6 items-center gap-1">
                  Last Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Dela Cruz" className="h-9" />
                </FormControl>
                <FormMessage />
                <div className="h-5"></div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="extensionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex h-6 items-center gap-1">
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
                    <SelectTrigger className="h-9">
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
                <FormMessage />
                <div className="h-5"></div>
              </FormItem>
            )}
          />
        </div>

        {/* Date of Birth Section */}
        <div className="pt-1">
          <FormField
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1 flex items-center gap-2 text-sm font-medium">
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StepPersonalInfo;
