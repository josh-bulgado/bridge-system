import { UserPlus, Send, Download, FileText, ArrowRight } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Sign up steps section */}
        <div className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <p className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wide mb-2">
              Get started now
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-4">
              Request in 3 simple steps
            </h2>
          </div>
          
          <div className="relative">
            {/* Desktop connector line */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      1
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold">Register an Account</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Provide your mobile number and authenticate with a One-Time Pin
                  </p>
                </div>
                {/* Arrow for mobile */}
                <div className="flex justify-center my-4 md:hidden">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary rotate-90" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Send className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      2
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold">Submit Request</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Complete the online form and upload required documents
                  </p>
                </div>
                {/* Arrow for mobile */}
                <div className="flex justify-center my-4 md:hidden">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary rotate-90" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Download className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      3
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold">Receive Document</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Download your verified digital document or claim at the office
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Services Section */}
        <div className="bg-muted/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wide mb-2">
              Our Services
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Available Services
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              Request official barangay documents online
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* Certificate of Residency */}
            <div className="group flex flex-col items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-xl bg-card border-2 border-border hover:border-primary/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 rounded-xl transition-colors">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-center">Certificate of Residency</h4>
            </div>

            {/* Barangay Clearance */}
            <div className="group flex flex-col items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-xl bg-card border-2 border-border hover:border-primary/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 rounded-xl transition-colors">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-center">Barangay Clearance</h4>
            </div>

            {/* Certificate of Indigency */}
            <div className="group flex flex-col items-center justify-center gap-3 sm:gap-4 p-6 sm:p-8 rounded-xl bg-card border-2 border-border hover:border-primary/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 rounded-xl transition-colors">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-center">Certificate of Indigency</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
