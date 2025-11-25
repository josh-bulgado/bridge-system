import { z } from "zod";

// Address validation schema
export const barangayConfigSchema = z.object({
  barangayCaptain: z
    .string()
    .min(1, "Barangay Captain name is required")
    .min(2, "Captain name must be at least 2 characters"),
  logoUrl: z
    .string()
    .min(1, "Barangay logo is required")
    .url("Invalid logo URL")
    .refine((url) => url.includes("cloudinary.com"), {
      message: "Logo must be uploaded through Cloudinary",
    }),
  address: z.object({
    regionCode: z.string().min(1, "Region is required"),
    regionName: z.string().min(1, "Region name is required"),
    provinceCode: z.string().min(1, "Province is required"),
    provinceName: z.string().min(1, "Province name is required"),
    municipalityCode: z.string().min(1, "Municipality is required"),
    municipalityName: z.string().min(1, "Municipality name is required"),
    barangayCode: z.string().min(1, "Barangay is required"),
    barangayName: z.string().min(1, "Barangay name is required"),
  }),
  contact: z.object({
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^(\+63|0)?[0-9]{10}$/,
        "Please enter a valid Philippine phone number",
      ),
    email: z.email("Please enter a valid email address"),
  }),
  officeHours: z.string().min(1, "Office hours are required"),
  // GCash Payment Information (Optional)
  gcashNumber: z
    .string()
    .regex(/^(09|\+639)\d{9}$/, "Please enter a valid GCash number")
    .optional()
    .or(z.literal("")),
  gcashAccountName: z.string().optional().or(z.literal("")),
  gcashQrCodeUrl: z
    .string()
    .url("Invalid QR code URL")
    .optional()
    .or(z.literal("")),
});

// Contact information validation schema
export const contactInfoSchema = z.object({});

// Day schedule validation schema
export const dayScheduleSchema = z
  .object({
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
    breakTime: z
      .object({
        start: z.string(),
        end: z.string(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If day is open, must have open and close times
      if (data.isOpen) {
        return data.openTime && data.closeTime;
      }
      return true;
    },
    {
      message: "Open and close times are required when day is open",
      path: ["openTime"],
    },
  )
  .refine(
    (data) => {
      // Validate time order: openTime < closeTime
      if (data.isOpen && data.openTime && data.closeTime) {
        const openHour = parseTime(data.openTime);
        const closeHour = parseTime(data.closeTime);
        return openHour < closeHour;
      }
      return true;
    },
    {
      message: "Close time must be after open time",
      path: ["closeTime"],
    },
  )
  .refine(
    (data) => {
      // Validate break time is within operating hours
      if (data.breakTime && data.openTime && data.closeTime) {
        const openHour = parseTime(data.openTime);
        const closeHour = parseTime(data.closeTime);
        const breakStart = parseTime(data.breakTime.start);
        const breakEnd = parseTime(data.breakTime.end);

        return (
          breakStart >= openHour &&
          breakEnd <= closeHour &&
          breakStart < breakEnd
        );
      }
      return true;
    },
    {
      message: "Break time must be within operating hours",
      path: ["breakTime"],
    },
  );

// Office hours validation schema
export const officeHoursSchema = z
  .object({
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema,
    saturday: dayScheduleSchema,
    sunday: dayScheduleSchema,
  })
  .refine(
    (data) => {
      // At least one day must be open
      const openDays = Object.values(data).filter((day) => day.isOpen);
      return openDays.length > 0;
    },
    {
      message: "At least one day must be open",
      path: ["monday"], // Show error on first day
    },
  );

// Main barangay configuration schema
// export const barangayConfigSchema = z.object({
//   address: addressSchema,
//   contactInfo: contactInfoSchema,
//   officeHours: officeHoursSchema,
// });

// Helper function to parse time string to minutes since midnight
function parseTime(timeStr: string): number {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let totalMinutes = hours * 60 + minutes;

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    totalMinutes -= 12 * 60;
  }

  return totalMinutes;
}

// Export types
// export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type DayScheduleFormData = z.infer<typeof dayScheduleSchema>;
export type OfficeHoursFormData = z.infer<typeof officeHoursSchema>;
export type BarangayConfigFormData = z.infer<typeof barangayConfigSchema>;
