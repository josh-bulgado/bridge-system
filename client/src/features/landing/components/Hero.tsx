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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50 dark:from-background dark:via-background dark:to-primary/5 pt-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs - responsive sizes */}
        <div className="absolute top-10 sm:top-20 right-5 sm:right-20 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 dark:from-primary/10 dark:to-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-20 w-64 sm:w-80 md:w-[500px] h-64 sm:h-80 md:h-[500px] bg-gradient-to-tr from-green-400/20 to-emerald-400/20 dark:from-primary/5 dark:to-primary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 md:w-[700px] h-80 sm:h-96 md:h-[700px] bg-gradient-to-br from-teal-400/10 to-green-400/10 dark:from-primary/5 dark:to-primary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating decorative shapes - hidden on small screens */}
        <div className="hidden sm:block absolute top-40 left-40 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-lg rotate-12 animate-float"></div>
        <div className="hidden md:block absolute bottom-40 right-60 w-20 md:w-24 h-20 md:h-24 bg-blue-400/10 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="hidden lg:block absolute top-60 right-40 w-16 md:w-20 h-16 md:h-20 bg-green-400/10 rounded-lg -rotate-12 animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl mx-auto py-12 sm:py-16 md:py-20">
        {/* Text Content */}
        <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left animate-fade-in-up w-full">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent animate-slide-in-left leading-tight">
              Service made simple
            </h1>
            <h1 className="text-primary scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 dark:from-primary dark:to-emerald-400 bg-clip-text text-transparent animate-slide-in-left leading-tight" style={{animationDelay: '0.2s'}}>
              Bringing your barangay online
            </h1>
          </div>

          <p className="mx-auto lg:mx-0 max-w-2xl text-base sm:text-lg md:text-xl text-gray-700 dark:text-muted-foreground leading-relaxed animate-fade-in px-2 sm:px-0" style={{animationDelay: '0.4s'}}>
            Bridge makes requesting barangay documents faster, safer, and more
            transparent — connecting residents and local offices with ease.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-4 animate-fade-in px-4 sm:px-0" style={{animationDelay: '0.6s'}}>
            <AuthButtons mainText="Create account" reverse />
          </div>
        </div>

        {/* Image/Illustration Placeholder */}
        <div className="flex-1 flex items-center justify-center animate-fade-in-up w-full max-w-sm sm:max-w-md lg:max-w-lg" style={{animationDelay: '0.8s'}}>
          <div className="relative w-full aspect-square">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-primary/20 animate-ping-slow"></div>
            <div className="absolute inset-4 sm:inset-8 rounded-full border border-blue-400/30 sm:border-2 animate-ping-slow" style={{animationDelay: '0.5s'}}></div>
            
            {/* Main card with enhanced design */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-emerald-400/20 to-teal-400/30 dark:from-primary/20 dark:via-primary/10 dark:to-primary/5 rounded-2xl sm:rounded-3xl backdrop-blur-sm border-2 border-white/40 dark:border-primary/20 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
              <div className="text-center p-4 sm:p-6 md:p-8">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-primary dark:to-primary/70 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                  <svg className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-muted-foreground font-bold">Digital Services</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground mt-1 sm:mt-2">Access anytime, anywhere</p>
              </div>
            </div>
            
            {/* Floating particles - adjusted for mobile */}
            <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-float"></div>
            <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 right-2 sm:right-5 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2 cursor-pointer hover:scale-110 transition-transform" 
        onClick={scrollToAbout}
      >
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Scroll Down</p>
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-bounce" />
      </div>
    </div>
  );
};
