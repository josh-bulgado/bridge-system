import { UserPlus, Send, Download, FileText } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="pt-20 pb-4 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-base font-bold mb-4 text-center">
          Get started now
        </h2>
        <h3 className="text-3xl font-bold mb-12 text-center">
          Request in 3 simple steps
        </h3>
        
        <div className="flex items-center justify-center gap-4 mb-16">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 border-2 rounded-lg shadow-sm bg-card max-w-xs">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold">Register an Account</h4>
            <p className="text-muted-foreground text-justify">
              Provide your mobile number and authenticate with a One-Time Pin
            </p>
          </div>

          {/* Connector Line 1 */}
          <div className="hidden md:block w-16 h-0.5 bg-primary/30"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 border-2 rounded-lg shadow-sm bg-card max-w-xs">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold">Submit Request</h4>
            <p className="text-muted-foreground text-justify">
              Complete the online form and upload required documents
            </p>
          </div>

          {/* Connector Line 2 */}
          <div className="hidden md:block w-16 h-0.5 bg-primary/30"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 p-6 border-2 rounded-lg shadow-sm bg-card max-w-xs">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold">Receive Document</h4>
            <p className="text-muted-foreground text-justify">
              Download your verified digital document or claim at the office
            </p>
          </div>
        </div>

        {/* Available Services Section */}
        <div className="mt-32">
          <h3 className="text-3xl font-bold mb-4 text-center">
            Available Services
          </h3>
          <p className="text-base text-muted-foreground mb-8 text-center">
            Request official barangay documents online
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Certificate of Residency */}
            <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-lg shadow-sm bg-card min-h-[140px]">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-center">Certificate of Residency</h4>
            </div>

            {/* Barangay Clearance */}
            <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-lg shadow-sm bg-card min-h-[140px]">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-center">Barangay Clearance</h4>
            </div>

            {/* Certificate of Indigency */}
            <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 rounded-lg shadow-sm bg-card min-h-[140px]">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0 rounded">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-center">Certificate of Indigency</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
