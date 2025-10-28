import { Clock, Shield, UserPlus, Zap } from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
}

interface RegistrationFeaturesListProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: UserPlus,
    title: "Quick Registration",
    description: "Sign up in minutes with just basic information — complete verification later when needed."
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Start requesting documents immediately after registration — no waiting for approvals."
  },
  {
    icon: Clock,
    title: "Track Everything",
    description: "Monitor your document requests and payments in real-time from your personal dashboard."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your personal information is protected with bank-level security and encryption."
  }
];

export const RegistrationFeaturesList: React.FC<RegistrationFeaturesListProps> = ({ 
  features = defaultFeatures 
}) => {
  return (
    <div className="space-y-4">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div key={index} className="grid grid-cols-[50px_auto] items-center gap-4">
            <IconComponent
              className="m-2 mt-1 aspect-square rounded-md bg-green-50 p-2 text-green-500"
              size={40}
            />
            <div className="flex-2">
              <h4 className="scroll-m-20 items-baseline text-2xl font-semibold tracking-tight">
                {feature.title}
              </h4>
              <p className="leading-7">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};