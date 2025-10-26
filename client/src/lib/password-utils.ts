export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return "weak";
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // special characters
  
  // Additional complexity
  if (password.length >= 16) score += 1;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) score += 1;
  
  if (score <= 2) return "weak";
  if (score <= 4) return "fair";
  if (score <= 6) return "good";
  return "strong";
};

export const strengthConfig = {
  weak: {
    label: "Weak",
    color: "bg-red-500",
    width: "w-1/4",
    textColor: "text-red-600",
  },
  fair: {
    label: "Fair",
    color: "bg-orange-500",
    width: "w-2/4",
    textColor: "text-orange-600",
  },
  good: {
    label: "Good",
    color: "bg-yellow-500",
    width: "w-3/4",
    textColor: "text-yellow-600",
  },
  strong: {
    label: "Strong",
    color: "bg-green-500",
    width: "w-full",
    textColor: "text-green-600",
  },
};