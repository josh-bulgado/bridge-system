import {
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (code: string[]) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  onComplete?: (code: string) => void;
}

export const OTPInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  success = false,
  onComplete,
}: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Check if code is complete and trigger callback
  useEffect(() => {
    const isComplete = value.every((digit) => digit !== "");
    if (isComplete && onComplete) {
      onComplete(value.join(""));
    }
  }, [value, onComplete]);

  // Handle input change
  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    if (!/^\d*$/.test(inputValue)) return;

    // Only allow single digit
    if (inputValue.length > 1) return;

    const newCode = [...value];
    newCode[index] = inputValue;
    onChange(newCode);

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down events
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty, focus previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newCode = [...value];
        newCode[index - 1] = "";
        onChange(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only accept 6-digit numeric values
    if (!/^\d{6}$/.test(pastedData)) {
      return;
    }

    const newCode = pastedData.split("");
    onChange(newCode);

    // Focus last input
    inputRefs.current[length - 1]?.focus();
  };

  // Determine input border color
  const getInputBorderColor = () => {
    if (success) return "border-primary";
    if (error) return "border-destructive";
    return "border-input";
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className={`bg-background focus-visible:ring-ring h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold transition-all duration-200 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14 sm:text-2xl ${getInputBorderColor()}`}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
};
