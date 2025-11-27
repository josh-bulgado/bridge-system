import React from "react";
import { Calendar } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  isVerified?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "Resident",
  isVerified = false,
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {userName}!
        </h1>
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <p className="text-sm">{currentDate}</p>
        </div>
      </div>
      
      {/* Verified Badge - Only show for verified users */}
      {isVerified && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 p-1">
              <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">Verified</p>
          </div>
        </div>
      )}
    </div>
  );
};
