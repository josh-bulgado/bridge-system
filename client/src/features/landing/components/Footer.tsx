import BridgeIcon from "@/components/bridge-icon";

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 md:mt-20 lg:mt-24 border-t border-slate-800">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-6 sm:mb-8">
          {/* Left Section - Logo and Copyright */}
          <div className="flex flex-col gap-3 sm:gap-4 text-center sm:text-left">
            <div className="mb-1 sm:mb-2 flex justify-center sm:justify-start">
              <BridgeIcon variant="secondary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-slate-400">Copyright © 2025</p>
              <p className="text-xs sm:text-sm text-slate-400">Republic of the Philippines</p>
              <p className="text-xs sm:text-sm text-slate-400">All Rights Reserved</p>
            </div>
          </div>

          {/* Middle Section - About Links */}
          <div className="flex flex-col gap-2 sm:gap-3 text-center sm:text-left">
            <h3 className="font-bold text-white text-sm sm:text-base mb-1 sm:mb-2 uppercase tracking-wide">
              ABOUT US
            </h3>
            <a 
              href="#about" 
              className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer sm:hover:translate-x-1 inline-block transform transition-transform"
            >
              About Bridge
            </a>
            <span className="text-xs sm:text-sm text-slate-400 hover:text-slate-300 cursor-pointer">
              Terms & Conditions
            </span>
            <span className="text-xs sm:text-sm text-slate-400 hover:text-slate-300 cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-xs sm:text-sm text-slate-400 hover:text-slate-300 cursor-pointer">
              FAQs
            </span>
          </div>

          {/* Right Section - Additional Info */}
          <div className="flex flex-col gap-2 sm:gap-3 text-center sm:text-left sm:col-span-2 md:col-span-1">
            <h3 className="font-bold text-white text-sm sm:text-base mb-1 sm:mb-2 uppercase tracking-wide">
              CONNECT WITH US
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Bringing government services closer to the people through digital innovation.
            </p>
          </div>
        </div>

        {/* Bottom Section - Divider and Additional Copyright */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs text-slate-500 text-center md:text-left">
              Built with modern web technologies for the Filipino people
            </p>
            <div className="flex gap-3 sm:gap-4">
              <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer">
                Accessibility
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer">
                Sitemap
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
