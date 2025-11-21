export interface DaySchedule {
  isOpen: boolean;
  openTime: string; // "08:00 AM"
  closeTime: string; // "05:00 PM"
  breakTime?: {
    start: string;
    end: string;
  };
}

export interface OfficeHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export const DAYS = [
  { key: 'monday' as keyof OfficeHours, label: 'Monday' },
  { key: 'tuesday' as keyof OfficeHours, label: 'Tuesday' },
  { key: 'wednesday' as keyof OfficeHours, label: 'Wednesday' },
  { key: 'thursday' as keyof OfficeHours, label: 'Thursday' },
  { key: 'friday' as keyof OfficeHours, label: 'Friday' },
  { key: 'saturday' as keyof OfficeHours, label: 'Saturday' },
  { key: 'sunday' as keyof OfficeHours, label: 'Sunday' },
] as const;

export const DEFAULT_OFFICE_HOURS: OfficeHours = {
  monday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
  tuesday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
  wednesday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
  thursday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
  friday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
  saturday: { isOpen: true, openTime: "08:00 AM", closeTime: "12:00 PM" },
  sunday: { isOpen: false, openTime: "", closeTime: "" },
};

export const GOVERNMENT_PRESETS = {
  "Standard Government Hours": {
    ...DEFAULT_OFFICE_HOURS
  },
  "Monday-Friday Only": {
    monday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
    tuesday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
    wednesday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
    thursday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
    friday: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
    saturday: { isOpen: false, openTime: "", closeTime: "" },
    sunday: { isOpen: false, openTime: "", closeTime: "" },
  },
  "Extended Hours": {
    monday: { isOpen: true, openTime: "07:00 AM", closeTime: "06:00 PM" },
    tuesday: { isOpen: true, openTime: "07:00 AM", closeTime: "06:00 PM" },
    wednesday: { isOpen: true, openTime: "07:00 AM", closeTime: "06:00 PM" },
    thursday: { isOpen: true, openTime: "07:00 AM", closeTime: "06:00 PM" },
    friday: { isOpen: true, openTime: "07:00 AM", closeTime: "06:00 PM" },
    saturday: { isOpen: true, openTime: "08:00 AM", closeTime: "02:00 PM" },
    sunday: { isOpen: false, openTime: "", closeTime: "" },
  }
};