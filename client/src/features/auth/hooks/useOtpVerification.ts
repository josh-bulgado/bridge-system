import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface UseOtpVerificationOptions {
  email: string;
  onSuccess?: () => void;
  onError?: (error: Error, attempts: number) => void;
}

export const useOtpVerification = ({ 
  email, 
  onSuccess, 
  onError 
}: UseOtpVerificationOptions) => {
  const navigate = useNavigate();

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      return await authService.verifyEmail(email, otp);
    },
    onSuccess: (data) => {
      onSuccess?.();
      
      // Use user data from verification response (user is now logged in automatically)
      const user = data.user;

      // Redirect directly to dashboard based on user role
      setTimeout(() => {
        if (user?.role) {
          const dashboardRoutes = {
            admin: '/admin',
            staff: '/staff', 
            resident: '/resident',
          } as const;
          
          const route = dashboardRoutes[user.role as keyof typeof dashboardRoutes] || '/resident';
          navigate(route, {
            replace: true, // Replace current history entry to prevent back navigation to OTP page
            state: {
              message: `Welcome ${user.firstName || user.email}! Email verified successfully.`,
              isNewVerification: true
            }
          });
        } else {
          // Fallback: if no role is provided, redirect to resident dashboard
          navigate('/resident', {
            replace: true,
            state: {
              message: 'Email verified successfully! Welcome to your dashboard.',
              isNewVerification: true
            }
          });
        }
      }, 2000);
    },
    onError: (error: Error) => {
      onError?.(error, 0); // We'll handle attempts in the component
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      return await authService.resendOtp(email);
    },
  });

  return {
    verify: verifyMutation.mutate,
    resend: resendMutation.mutate,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    verifyError: verifyMutation.error,
    resendError: resendMutation.error,
    isVerifySuccess: verifyMutation.isSuccess,
    isResendSuccess: resendMutation.isSuccess,
    reset: () => {
      verifyMutation.reset();
      resendMutation.reset();
    }
  };
};