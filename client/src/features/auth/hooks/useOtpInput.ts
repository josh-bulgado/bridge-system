import { useState, useRef, useCallback } from 'react';

interface UseOtpInputReturn {
  code: string[];
  setCode: (code: string[]) => void;
  clearCode: () => void;
  isComplete: boolean;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleInputChange: (index: number, value: string) => void;
  handleInput: (index: number, e: React.FormEvent<HTMLInputElement>) => void;
  handleKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (index: number, e: ClipboardEvent<HTMLInputElement>) => void;
  focusInput: (index: number) => void;
  triggerShakeAnimation: () => void;
}

export const useOtpInput = (length: number = 6): UseOtpInputReturn => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  const clearCode = useCallback(() => {
    setCode(Array(length).fill(''));
  }, [length]);

  const focusInput = useCallback((index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  }, []);

  const handleInputChange = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      // Handle AutoFill (if browser suggests the full OTP code)
      const digits = value.replace(/\D/g, '');
      const newCode = digits.slice(0, length).split('');
      setCode(newCode);
      focusInput(length - 1); // Focus the last input field after AutoFill
      return;
    }

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Focus the next input field after manual typing
    if (value && index < length - 1) {
      focusInput(index + 1);
    }
  }, [code, length, focusInput]);

  const handleInput = useCallback((index: number, e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (value.length > 1) {
      const digits = value.replace(/\D/g, '');
      const newCode = digits.slice(0, length).split('');
      setCode(newCode);
      target.value = newCode[index]; // Prevent display issues with multiple digits
      focusInput(length - 1); // Focus last input after AutoFill
      return;
    }
  }, [length, focusInput]);

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move focus back to the previous input if it's empty
        focusInput(index - 1);
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  }, [code, length, focusInput]);

  const handlePaste = useCallback((index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits

    if (!pastedData) {
      return false; // No valid digits to paste
    }

    const newCode = [...code];
    const remainingSlots = length - index;
    const dataToPaste = pastedData.slice(0, remainingSlots); // Only paste what fits

    // Fill from current index onwards
    for (let i = 0; i < dataToPaste.length; i++) {
      if (index + i < length) {
        newCode[index + i] = dataToPaste[i];
      }
    }

    setCode(newCode);
    
    // Focus the last filled input or last input if all are filled
    const lastFilledIndex = Math.min(index + dataToPaste.length - 1, length - 1);
    focusInput(lastFilledIndex);
    
    return true; // Return true to indicate successful paste
  }, [code, length, focusInput]);

  const triggerShakeAnimation = useCallback(() => {
    inputRefs.current.forEach((input) => {
      if (input) {
        input.classList.add('animate-shake');
        setTimeout(() => {
          input.classList.remove('animate-shake');
        }, 500);
      }
    });
  }, []);

  const isComplete = code.every((digit) => digit !== '');

  return {
    code,
    setCode,
    clearCode,
    isComplete,
    inputRefs,
    handleInputChange,
    handleInput,
    handleKeyDown,
    handlePaste,
    focusInput,
    triggerShakeAnimation,
  };
};
