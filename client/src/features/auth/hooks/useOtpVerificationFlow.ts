import { useState, useCallback, useEffect } from 'react';
import { useOtpInput } from './useOtpInput';
import { useOtpTimer } from './useOtpTimer';
import { useResendCooldown } from './useResendCooldown';
import { useOtpVerification } from './useOtpVerification';

interface UseOtpVerificationFlowOptions {
  email: string;
  initialDuration?: number;
  maxAttempts?: number;
}

export const useOtpVerificationFlow = ({
  email,
  initialDuration = 600,
  maxAttempts = 5,
}: UseOtpVerificationFlowOptions) => {
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom hooks
  const otpTimer = useOtpTimer(initialDuration);
  const resendCooldown = useResendCooldown(60);
  const otpInput = useOtpInput(6);

  const otpVerification = useOtpVerification({
    email,
    onSuccess: () => {
      setErrorMessage(null);
    },
    onError: (error) => {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        setErrorMessage('Too many failed attempts. Please resend code.');
      } else {
        setErrorMessage(error.message);
        
        // Trigger shake animation and clear inputs
        otpInput.triggerShakeAnimation();
        setTimeout(() => {
          otpInput.clearCode();
          otpInput.focusInput(0);  // Focus first input after failed attempt
        }, 1000);
      }
    },
  });

  // Handle verification
  const handleVerify = useCallback(() => {
    if (!otpInput.isComplete || otpVerification.isVerifying || otpTimer.isExpired || attempts >= maxAttempts) {
      return;
    }

    const code = otpInput.code.join('');
    setErrorMessage(null);
    otpVerification.verify(code);
  }, [otpInput.isComplete, otpInput.code, otpVerification, otpTimer.isExpired, attempts, maxAttempts]);

  // Handle resend
  const handleResend = useCallback(() => {
    if (resendCooldown.isCooldownActive || otpVerification.isResending) {
      return;
    }

    setErrorMessage(null);
    otpVerification.resend();
  }, [resendCooldown.isCooldownActive, otpVerification]);

  // Handle successful resend
  useEffect(() => {
    if (otpVerification.isResendSuccess) {
      otpTimer.resetTimer(initialDuration);
      resendCooldown.startCooldown(60);
      otpInput.clearCode();
      setAttempts(0);
      otpInput.focusInput(0);
      
      setErrorMessage('New code sent successfully! Check your email.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  }, [otpVerification.isResendSuccess, otpTimer, resendCooldown, otpInput, initialDuration]);

  // Handle resend error
  useEffect(() => {
    if (otpVerification.resendError) {
      setErrorMessage(otpVerification.resendError.message);
    }
  }, [otpVerification.resendError]);

  // Focus first input on mount
  useEffect(() => {
    otpInput.focusInput(0);
  }, [otpInput]);

  return {
    // OTP Input
    code: otpInput.code,
    isCodeComplete: otpInput.isComplete,
    inputRefs: otpInput.inputRefs,
    handleInputChange: otpInput.handleInputChange,
    handleInput: otpInput.handleInput,
    handleKeyDown: otpInput.handleKeyDown,
    handlePaste: useCallback((index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      const success = otpInput.handlePaste(index, e);
      if (!success) {
        setErrorMessage('Please paste a valid numeric code');
      }
    }, [otpInput]),
    
    // Timer
    timeRemaining: otpTimer.timeRemaining,
    isExpired: otpTimer.isExpired,
    formatTime: otpTimer.formatTime,
    
    // Verification
    handleVerify,
    isVerifying: otpVerification.isVerifying,
    isSuccess: otpVerification.isVerifySuccess,
    
    // Resend
    handleResend,
    isResending: otpVerification.isResending,
    resendCooldown: resendCooldown.cooldownTime,
    
    // Error handling
    errorMessage,
    attempts,
    maxAttempts,
    
    // Computed states
    canVerify: otpInput.isComplete && !otpVerification.isVerifying && !otpTimer.isExpired && attempts < maxAttempts,
    canResend: !resendCooldown.isCooldownActive && !otpVerification.isResending,
  };
};
