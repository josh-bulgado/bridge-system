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

export const AuthButtons = ({
  secondaryText = "Sign in",
  secondaryPath = "/sign-in",
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
        <Button className="min-w-30 transition-colors duration-200">
          {mainText}
        </Button>
      </Link>

      <Link to={secondaryPath}>
        <Button
          variant="secondary"
          className="min-w-25 transition-colors duration-200"
        >
          {secondaryText}
        </Button>
      </Link>
    </div>
  );
};

