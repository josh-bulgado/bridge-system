import { Button } from "@/components/ui/button";
import clsx from "clsx";

import { Link } from "react-router-dom";

interface AuthButtonsProps {
  signInText?: string;
  signInPath?: string;
  mainText?: string;
  mainPath?: string;
  reverse?: boolean;
}

const AuthButtons = ({
  signInText = "Sign in",
  signInPath = "/sign-in",
  mainText = "Get Started",
  mainPath = "/register",
  reverse = false,
}: AuthButtonsProps) => {
  return (
    <div
      className={clsx(
        "flex flex-wrap gap-x-2 sm:flex-nowrap sm:gap-x-4",
        reverse === false && "flex-row-reverse",
      )}
    >
      <Link to={mainPath}>
        <Button className="min-w-[120px] transition-colors duration-200">
          {mainText}
        </Button>
      </Link>
      <Link to={signInPath}>
        <Button
          variant="secondary"
          className="min-w-[100px] transition-colors duration-200"
        >
          {signInText}
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
