# OTP Components

This directory contains modular, reusable components for OTP (One-Time Password) verification.

## Components

### `OTPInput`
Renders 6 input boxes for entering OTP code with features:
- Auto-focus on first input
- Auto-advance to next input on entry
- Backspace navigation
- Arrow key navigation
- Paste support for 6-digit codes
- Error and success state styling

**Props:**
- `length?: number` - Number of digits (default: 6)
- `value: string[]` - Array of digit values
- `onChange: (code: string[]) => void` - Callback when code changes
- `disabled?: boolean` - Disable all inputs
- `error?: boolean` - Show error styling
- `success?: boolean` - Show success styling
- `onComplete?: (code: string) => void` - Callback when all digits entered

### `OTPTimer`
Displays countdown timer with expiry notification.

**Props:**
- `initialSeconds: number` - Starting time in seconds
- `onExpire?: () => void` - Callback when timer reaches zero
- `isActive?: boolean` - Whether timer is counting down

### `OTPSuccessAnimation`
Animated success message with checkmark icon.

**Props:**
- `title?: string` - Success message title
- `subtitle?: string` - Success message subtitle

### `OTPErrorMessage`
Displays error/success messages with attempt counter.

**Props:**
- `message: string | null` - Message to display
- `attempts?: number` - Current attempt count
- `maxAttempts?: number` - Maximum attempts allowed
- `type?: "error" | "success" | "info"` - Message type

### `OTPResendSection`
Resend button with cooldown timer.

**Props:**
- `onResend: () => Promise<void>` - Async callback to resend code
- `cooldownSeconds?: number` - Cooldown duration in seconds
- `disabled?: boolean` - Disable resend button

### `OTPHeader`
Header with title and description.

**Props:**
- `title?: string` - Header title
- `description?: string` - Header description

## Usage Example

```tsx
import {
  OTPInput,
  OTPTimer,
  OTPSuccessAnimation,
  OTPErrorMessage,
  OTPResendSection,
  OTPHeader,
} from "./otp";

function MyOTPForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    // Verification logic
  };

  const handleResend = async () => {
    // Resend logic
  };

  return (
    <div>
      <OTPHeader />
      {success ? (
        <OTPSuccessAnimation />
      ) : (
        <>
          <OTPInput value={code} onChange={setCode} />
          <OTPTimer initialSeconds={600} />
          <OTPErrorMessage message={error} />
          <button onClick={handleVerify}>Verify</button>
          <OTPResendSection onResend={handleResend} />
        </>
      )}
    </div>
  );
}
```

## Benefits of Modular Design

1. **Reusability** - Each component can be used independently in different contexts
2. **Maintainability** - Easier to update individual components without affecting others
3. **Testability** - Each component can be tested in isolation
4. **Flexibility** - Components can be composed in different ways
5. **Clarity** - Smaller, focused components are easier to understand
