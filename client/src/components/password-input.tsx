import { EyeOffIcon, Eye } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

interface PasswordInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder,
}: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        type={isPasswordVisible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          variant="ghost"
          size="icon-sm"
        >
          {isPasswordVisible ? <EyeOffIcon /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default PasswordInput;
