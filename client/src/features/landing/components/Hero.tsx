import AuthButtons from "@/features/auth/components/AuthButtons";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="flex h-svh flex-col justify-center gap-8 px-4 text-center sm:px-8 relative">
        <div className="space-y-4">
          <div>
            <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Service made simple
            </h1>
            <h1 className="text-primary scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Bringing your barangay online
            </h1>
          </div>

          <h4 className="mx-auto max-w-md text-center text-lg font-semibold tracking-tight text-gray-600 sm:max-w-lg sm:text-xl md:max-w-xl lg:max-w-2xl dark:text-gray-400">
            Bridge makes requesting barangay documents faster, safer, and more
            transparent — connecting residents and local offices with ease.
          </h4>
        </div>

        <div className="flex w-full justify-center gap-4">
          <AuthButtons mainText="Create account" reverse />
        </div>

        {/* Scroll Down Section */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={scrollToAbout}>
          <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
          <p className="text-sm font-medium text-muted-foreground">Scroll Down</p>
        </div>
      </div>
    </>
  );
};
