interface OTPHeaderProps {
  title?: string;
  description?: string;
}

export const OTPHeader = ({
  title = "Verify Your Email",
  description = "Enter the 6-digit code sent to your email",
}: OTPHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 text-center mb-8 sm:mb-10">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default OTPHeader;
