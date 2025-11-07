import { Lock, Key, Bell, Shield, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface VerificationFeaturesListProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: Shield,
    title: "Secure Account",
    description:
      "Email verification adds an extra layer of security to protect your account from unauthorized access.",
  },
  {
    icon: Key,
    title: "Password Recovery",
    description:
      "A verified email ensures you can always recover your account if you forget your password.",
  },
  {
    icon: Bell,
    title: "Get Notifications",
    description:
      "Stay updated on your document requests and important barangay announcements via email.",
  },
  {
    icon: Lock,
    title: "Full Access",
    description:
      "Complete verification to unlock all features and services available in your dashboard.",
  },
];

export const VerificationFeaturesList: React.FC<
  VerificationFeaturesListProps
> = ({ features = defaultFeatures }) => {
  return (
    <div className="space-y-4">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div
            key={index}
            className="grid grid-cols-[50px_auto] items-center gap-4"
          >
            <IconComponent
              className="m-2 mt-1 aspect-square rounded-md bg-green-50 p-2 text-green-500"
              size={40}
            />
            <div className="flex-2">
              <h4 className="scroll-m-20 items-baseline text-2xl font-semibold tracking-tight">
                {feature.title}
              </h4>
              <p className="leading-7">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
