import { useState } from 'react';
import { FormValues } from '../schemas/registerSchema';

interface RegistrationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegistration = () => {
  const [state, setState] = useState<RegistrationState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const register = async (data: FormValues) => {
    setState({ isLoading: true, error: null, success: false });

    try {
      // TODO: Implement actual API call to registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      setState({ isLoading: false, error: null, success: true });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState({ isLoading: false, error: errorMessage, success: false });
      throw error;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const reset = () => {
    setState({ isLoading: false, error: null, success: false });
  };

  return {
    ...state,
    register,
    clearError,
    reset,
  };
};