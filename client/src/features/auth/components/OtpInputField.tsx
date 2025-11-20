import type { KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputFieldProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (index: number, e: ClipboardEvent<HTMLInputElement>) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  disabled?: boolean;
  hasError?: boolean;
  isSuccess?: boolean;
}

export const OtpInputField = ({
  value,
  index,
  onChange,
  onKeyDown,
  onPaste,
  inputRef,
  disabled = false,
  hasError = false,
  isSuccess = false,
}: OtpInputFieldProps) => {
  const getBorderColor = () => {
    if (isSuccess) return 'border-primary';
    if (hasError) return 'border-destructive';
    return 'border-input';
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste ? (e) => onPaste(index, e) : undefined}
      autoComplete={index === 0 ? "one-time-code" : "off"}
      className={`h-12 w-12 rounded-md border bg-background text-center text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${getBorderColor()}`}
      disabled={disabled}
      aria-label={`Digit ${index + 1}`}
    />
  );
};