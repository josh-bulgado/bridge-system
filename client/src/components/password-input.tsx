import { EyeOffIcon, Eye } from "lucide-react";
import { useState, forwardRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ onChange, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("PasswordInput handleChange:", e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isPasswordVisible ? "text" : "password"}
          className="pr-10"
          onChange={handleChange}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPasswordVisible(!isPasswordVisible);
          }}
          tabIndex={-1}
        >
          {isPasswordVisible ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
