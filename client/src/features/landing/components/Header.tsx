import BridgeIcon from "@/components/bridge-icon";
import AuthButtons from "@/features/auth/components/AuthButtons";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-primary fixed z-50 flex w-full justify-between p-2 backdrop-blur-sm sm:px-8 lg:px-16">
      <div className="flex items-center text-center">
        <BridgeIcon variant="secondary" />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button 
          variant="ghost" 
          onClick={scrollToTop}
          className="text-secondary hover:text-secondary/80"
        >
          Home
        </Button>
        <Button 
          variant="ghost" 
          onClick={scrollToAbout}
          className="text-secondary hover:text-secondary/80"
        >
          About
        </Button>
        <Button 
          variant="ghost" 
          onClick={scrollToFeatures}
          className="text-secondary hover:text-secondary/80"
        >
          Features
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-secondary hover:text-secondary/80"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <AuthButtons
          reverse
          mainText="Sign in"
          mainPath="/sign-in"
          secondaryText="Get Started"
          secondaryPath="/register"
        />
      </div>
    </div>
  );
};
