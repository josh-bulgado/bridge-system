import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { RotateCcw, Clock, Copy } from "lucide-react";
import {
  type OfficeHours,
  type DaySchedule,
  DAYS,
  DEFAULT_OFFICE_HOURS,
  GOVERNMENT_PRESETS,
} from "../types/officeHours";
import TimePicker from "./TimePicker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";

interface OfficeHoursConfigurationProps {
  value: OfficeHours;
  onChange: (officeHours: OfficeHours) => void;
}

const OfficeHoursConfiguration: React.FC<OfficeHoursConfigurationProps> = ({
  value,
  onChange,
}) => {
  const handleDayScheduleChange = (
    day: keyof OfficeHours,
    schedule: DaySchedule,
  ) => {
    onChange({
      ...value,
      [day]: schedule,
    });
  };

  const handlePresetChange = (presetName: string) => {
    if (presetName in GOVERNMENT_PRESETS) {
      onChange(
        GOVERNMENT_PRESETS[presetName as keyof typeof GOVERNMENT_PRESETS],
      );
    }
  };

  const handleReset = () => {
    onChange(DEFAULT_OFFICE_HOURS);
  };

  const copyScheduleFromPrevious = (currentIndex: number) => {
    if (currentIndex > 0) {
      const previousDay = DAYS[currentIndex - 1];
      const previousSchedule = value[previousDay.key];
      const currentDay = DAYS[currentIndex];
      handleDayScheduleChange(currentDay.key, { ...previousSchedule });
    }
  };

  const formatScheduleSummary = () => {
    const openDays = DAYS.filter((day) => value[day.key].isOpen);
    if (openDays.length === 0) return "Closed all days";

    if (openDays.length === 7) return "Open 7 days a week";
    if (
      openDays.length === 5 &&
      openDays.every((day) => !["saturday", "sunday"].includes(day.key))
    ) {
      return "Monday-Friday only";
    }

    return `Open ${openDays.length} days a week`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Office Hours
        </CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Header with summary and controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground flex w-full items-center gap-2 text-sm">
                  <Clock size={16} />
                  Schedule Summary:
                </div>
              </div>
              <Badge variant="secondary">{formatScheduleSummary()}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Quick Presets:</Label>
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose preset" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(GOVERNMENT_PRESETS).map((preset) => (
                    <SelectItem key={preset} value={preset}>
                      {preset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Day schedule accordion */}
          <Accordion type="multiple" className="w-full">
            {DAYS.map((day, index) => {
              const schedule = value[day.key];
              return (
                <AccordionItem key={day.key} value={day.key}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center justify-between pr-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={schedule.isOpen}
                          onCheckedChange={(isOpen) => {
                            const updatedSchedule = {
                              ...schedule,
                              isOpen,
                              openTime: isOpen && !schedule.openTime ? "08:00 AM" : schedule.openTime,
                              closeTime: isOpen && !schedule.closeTime ? "05:00 PM" : schedule.closeTime,
                            };
                            handleDayScheduleChange(day.key, updatedSchedule);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="font-medium">{day.label}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.isOpen && schedule.openTime && schedule.closeTime
                          ? `${schedule.openTime} - ${schedule.closeTime}`
                          : schedule.isOpen ? "Click to set hours" : "Closed"}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-4">
                      {schedule.isOpen && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-sm">Open Time</Label>
                              <TimePicker
                                value={schedule.openTime}
                                onChange={(value) => {
                                  const updatedSchedule = { ...schedule, openTime: value };
                                  handleDayScheduleChange(day.key, updatedSchedule);
                                }}
                                placeholder="Opening time"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm">Close Time</Label>
                              <TimePicker
                                value={schedule.closeTime}
                                onChange={(value) => {
                                  const updatedSchedule = { ...schedule, closeTime: value };
                                  handleDayScheduleChange(day.key, updatedSchedule);
                                }}
                                placeholder="Closing time"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={!!schedule.breakTime}
                              onCheckedChange={(hasBreak) => {
                                const updatedSchedule = hasBreak
                                  ? {
                                      ...schedule,
                                      breakTime: { start: "12:00 PM", end: "01:00 PM" },
                                    }
                                  : { ...schedule, breakTime: undefined };
                                handleDayScheduleChange(day.key, updatedSchedule);
                              }}
                            />
                            <Label className="text-sm">Include break time</Label>
                          </div>

                          {schedule.breakTime && (
                            <div className="grid grid-cols-2 gap-3 pl-6 border-l border-dashed border-muted">
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Break Start</Label>
                                <TimePicker
                                  value={schedule.breakTime.start}
                                  onChange={(value) => {
                                    const updatedSchedule = {
                                      ...schedule,
                                      breakTime: { ...schedule.breakTime!, start: value },
                                    };
                                    handleDayScheduleChange(day.key, updatedSchedule);
                                  }}
                                  placeholder="Break start"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Break End</Label>
                                <TimePicker
                                  value={schedule.breakTime.end}
                                  onChange={(value) => {
                                    const updatedSchedule = {
                                      ...schedule,
                                      breakTime: { ...schedule.breakTime!, end: value },
                                    };
                                    handleDayScheduleChange(day.key, updatedSchedule);
                                  }}
                                  placeholder="Break end"
                                />
                              </div>
                            </div>
                          )}

                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyScheduleFromPrevious(index)}
                              className="flex items-center gap-1"
                            >
                              <Copy className="h-3 w-3" />
                              Copy from {DAYS[index - 1].label}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Preview */}
          <div className="bg-muted/30 rounded-lg border p-4">
            <Label className="text-sm font-medium">Schedule Preview:</Label>
            <div className="mt-2 space-y-1">
              {DAYS.map((day) => {
                const schedule = value[day.key];
                return (
                  <div key={day.key} className="flex justify-between text-sm">
                    <span className="font-medium">{day.label}:</span>
                    <span className="text-muted-foreground">
                      {schedule.isOpen ? (
                        <>
                          {schedule.openTime} - {schedule.closeTime}
                          {schedule.breakTime && (
                            <span className="ml-2 text-xs">
                              (Break: {schedule.breakTime.start} -{" "}
                              {schedule.breakTime.end})
                            </span>
                          )}
                        </>
                      ) : (
                        "Closed"
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficeHoursConfiguration;
