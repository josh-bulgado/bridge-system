import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => {
      // Remove all non-digit characters
      const digitsOnly = val.replace(/\D/g, "");
      // Philippine mobile numbers: 09XXXXXXXXX (11 digits) or +639XXXXXXXXX (12 digits with country code)
      const philippinePatterns = [
        /^09[0-9]{9}$/, // 09XXXXXXXXX format
        /^\\+639[0-9]{9}$/, // +639XXXXXXXXX format
        /^639[0-9]{9}$/, // 639XXXXXXXXX format (without + symbol)
      ];
      return philippinePatterns.some((pattern) => pattern.test(digitsOnly));
    }, "Please enter a valid Philippine mobile number"),
  code: z
    .array(z.string().regex(/^\d$/, "Each digit must be a number"))
    .length(6, "Verification code must be exactly 6 digits"),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

// Interface for OTP verification page props
export interface VerifyOTPPageProps {
  email?: string;
  phone?: string;
}

// Interface for OTP component state
export interface OTPState {
  code: string[]; // Array of 6 digits
  timeRemaining: number; // seconds
  resendCooldown: number; // seconds
  attempts: number;
  isVerifying: boolean;
  error: string | null;
  success: boolean;
  isResending: boolean;
}

// OTP verification response types
export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

export interface OTPResendResponse {
  success: boolean;
  message: string;
  expiresIn: number; // seconds
}