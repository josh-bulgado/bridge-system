import BridgeIcon from "@/components/bridge-icon";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-8 px-4 sm:px-8 lg:px-16 mt-32">
      <div className="container mx-auto flex flex-col md:flex-row items-start justify-between max-w-4xl">
        {/* Left Section */}
        <div className="flex flex-col gap-2">
          <BridgeIcon className="h-6 w-6" />
          <p className="text-sm text-muted-foreground">Copyright © 2025</p>
          <p className="text-sm text-muted-foreground">Republic of the Philippines</p>
          <p className="text-sm text-muted-foreground">All Rights Reserved</p>
        </div>

        {/* Right Section - Centered */}
        <div className="flex flex-col gap-2 mt-8 md:mt-0">
          <h3 className="font-semibold text-lg mb-2">ABOUT US</h3>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            About bridge
          </a>
          <span className="text-sm text-muted-foreground cursor-default">
            Terms & Conditions
          </span>
          <span className="text-sm text-muted-foreground cursor-default">
            Privacy Policy
          </span>
          <span className="text-sm text-muted-foreground cursor-default">
            FAQs
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
