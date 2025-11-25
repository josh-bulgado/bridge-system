import { cn } from "@/lib/utils";
import { calculatePasswordStrength, strengthConfig } from "@/lib/password-utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength = ({ password, className }: PasswordStrengthProps) => {
  const strength = calculatePasswordStrength(password);
  const config = strengthConfig[strength];
  
  if (!password) return null;
  
  return (
    <div className={cn(
      "space-y-3 animate-in slide-in-from-top-2 fade-in duration-300 ease-out",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Password strength</span>
        <span className={cn(
          "text-xs font-semibold transition-colors duration-200 ease-in-out",
          config.textColor
        )}>
          {config.label}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            config.color,
            config.width
          )}
        />
      </div>
      <div className="space-y-2 pt-1">
        <PasswordRequirement
          met={password.length >= 8}
          text="At least 8 characters"
        />
        <PasswordRequirement
          met={/[a-z]/.test(password) && /[A-Z]/.test(password)}
          text="Mixed case letters"
        />
        <PasswordRequirement
          met={/[0-9]/.test(password)}
          text="At least 1 number"
        />
        <PasswordRequirement
          met={/[^A-Za-z0-9]/.test(password)}
          text="At least 1 special character"
        />
      </div>
    </div>
  );
};

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

const PasswordRequirement = ({ met, text }: PasswordRequirementProps) => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full transition-colors duration-200",
        met ? "bg-green-500" : "bg-muted-foreground/30"
      )}
    />
    <span
      className={cn(
        "text-xs transition-colors duration-200",
        met ? "text-green-600" : "text-muted-foreground"
      )}
    >
      {text}
    </span>
  </div>
);