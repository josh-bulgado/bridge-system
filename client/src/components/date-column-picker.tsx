import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Calendar, ChevronDown } from "lucide-react";

interface DateColumnPickerProps {
  value?: Date;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper function to get the number of days in a month
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

// Generate array of numbers for scrolling
const generateArray = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function DateColumnPicker({
  value,
  onDateChange,
  className,
}: DateColumnPickerProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // Allow ages up to 100
  const maxYear = currentYear - 13; // Minimum age of 13

  // Initialize state from value prop
  const [selectedMonth, setSelectedMonth] = useState(
    value ? value.getMonth() : 0,
  );
  const [selectedDay, setSelectedDay] = useState(value ? value.getDate() : 1);
  const [selectedYear, setSelectedYear] = useState(
    value ? value.getFullYear() : maxYear,
  );

  // Update state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedMonth(value.getMonth());
      setSelectedDay(value.getDate());
      setSelectedYear(value.getFullYear());
    }
  }, [value]);

  // Generate years array
  const years = generateArray(minYear, maxYear);

  // Get max days for current month/year
  const maxDays = getDaysInMonth(selectedMonth + 1, selectedYear);
  const days = generateArray(1, maxDays);

  // Create new date and call onChange
  const updateDate = (month: number, day: number, year: number) => {
    // Adjust day if it's greater than the max days in the selected month
    const adjustedDay = Math.min(day, getDaysInMonth(month + 1, year));
    const newDate = new Date(year, month, adjustedDay);
    onDateChange?.(newDate);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = parseInt(monthIndex);
    setSelectedMonth(newMonth);
    updateDate(newMonth, selectedDay, selectedYear);
  };

  const handleDayChange = (dayValue: string) => {
    const newDay = parseInt(dayValue);
    setSelectedDay(newDay);
    updateDate(selectedMonth, newDay, selectedYear);
  };

  const handleYearChange = (yearValue: string) => {
    const newYear = parseInt(yearValue);
    setSelectedYear(newYear);
    updateDate(selectedMonth, selectedDay, newYear);
  };

  // Adjust day if current day is invalid for the selected month
  useEffect(() => {
    if (selectedDay > maxDays) {
      const adjustedDay = maxDays;
      setSelectedDay(adjustedDay);
      updateDate(selectedMonth, adjustedDay, selectedYear);
    }
  }, [maxDays, selectedMonth, selectedYear]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-3">
        {/* Month Select */}
        <div className="flex-1 space-y-2">
          <label className="text-foreground text-sm font-medium">Month</label>
          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day Select */}
        <div className="flex-1 space-y-2">
          <label className="text-foreground text-sm font-medium">Day</label>
          <Select
            value={selectedDay.toString()}
            onValueChange={handleDayChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {days.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Select */}
        <div className="flex-1 space-y-2">
          <label className="text-foreground text-sm font-medium">Year</label>
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
