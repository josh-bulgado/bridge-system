import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Link } from "react-router-dom";
interface AuthButtonsProps {
  secondaryText?: string;
  secondaryPath?: string;
  mainText?: string;
  mainPath?: string;
  reverse?: boolean;
}

const AuthButtons = ({
  secondaryText = "Sign in",
  secondaryPath = "/sign-in",
  mainText = "Get Started",
  mainPath = "/register",
  reverse = false,
}: AuthButtonsProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row gap-2 sm:gap-x-2 md:gap-x-4 w-full sm:w-auto",
        reverse === false && "sm:flex-row-reverse",
      )}
    >
      <Link to={mainPath} className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto min-w-[120px] transition-colors duration-200">
          {mainText}
        </Button>
      </Link>

      <Link to={secondaryPath} className="w-full sm:w-auto">
        <Button
          variant="secondary"
          className="w-full sm:w-auto min-w-[120px] transition-colors duration-200"
        >
          {secondaryText}
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
