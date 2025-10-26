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
    <div className={clsx("flex gap-x-4", reverse === false && "flex-row-reverse")}>
      <Link to={mainPath}>
        <Button className="bg-green-500">{mainText}</Button>
      </Link>
      <Link to={signInPath}>
        <Button variant="secondary">{signInText}</Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
