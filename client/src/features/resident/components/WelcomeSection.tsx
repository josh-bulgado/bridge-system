import React from "react";

interface WelcomeSectionProps {
  userName?: string;
  title?: string;
  subtitle?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName = "Resident",
  title,
  subtitle,
}) => {
  const displayTitle = title || `Welcome back, ${userName}!`;
  const displaySubtitle = subtitle || "Track your requests and manage your barangay services";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        {displayTitle}
      </h1>
      <p className="mt-2 text-gray-600">
        {displaySubtitle}
      </p>
    </div>
  );
};