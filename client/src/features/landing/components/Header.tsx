import BridgeIcon from "@/components/bridge-icon";
import AuthButtons from "@/features/auth/components/AuthButtons";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md fixed z-50 w-full border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center">
          <BridgeIcon />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Button 
            variant="ghost" 
            onClick={scrollToTop}
            className="text-sm font-medium hover:text-primary transition-colors px-3"
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            onClick={scrollToAbout}
            className="text-sm font-medium hover:text-primary transition-colors px-3"
          >
            About
          </Button>
          <Button 
            variant="ghost" 
            onClick={scrollToFeatures}
            className="text-sm font-medium hover:text-primary transition-colors px-3"
          >
            Features
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2 hover:text-primary transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="ml-2">
            <AuthButtons
              reverse
              mainText="Sign in"
              mainPath="/sign-in"
              secondaryText="Get Started"
              secondaryPath="/register"
            />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:text-primary transition-colors"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Button 
              variant="ghost" 
              onClick={scrollToTop}
              className="text-sm font-medium hover:text-primary transition-colors justify-start"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={scrollToAbout}
              className="text-sm font-medium hover:text-primary transition-colors justify-start"
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={scrollToFeatures}
              className="text-sm font-medium hover:text-primary transition-colors justify-start"
            >
              Features
            </Button>
            <div className="pt-2 border-t border-border mt-2">
              <AuthButtons
                reverse
                mainText="Sign in"
                mainPath="/sign-in"
                secondaryText="Get Started"
                secondaryPath="/register"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
