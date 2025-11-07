import { Clock, FileText, Lock, Zap } from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
}

interface AuthFeaturesListProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: FileText,
    title: "Request Online",
    description:
      "Submit your barangay document requests anytime, anywhere — no more long lines or multiple visits.",
  },
  {
    icon: Clock,
    title: "Track in Real Time",
    description:
      "Submit your barangay document requests anytime, anywhere — no more long lines or multiple visits.",
  },
  {
    icon: Zap,
    title: "Faster Processing",
    description:
      "Barangay staff manage and verify requests digitally for quicker approvals.",
  },
  {
    icon: Lock,
    title: "Secure & Transparent",
    description:
      "Your information stays protected with verified access and clear digital records.",
  },
];

export const AuthFeaturesList: React.FC<AuthFeaturesListProps> = ({
  features = defaultFeatures,
}) => {
  return (
    <div className="space-y-4">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div key={index} className="grid grid-cols-[50px_auto] gap-4">
            <IconComponent
              className="bg-card text-primary m-2 mt-1 aspect-square rounded-md p-2"
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
