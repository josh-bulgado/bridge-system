import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const DocumentTypeInfo = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 py-2">
      <InfoIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
      <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
        <strong className="text-sm">Requirements:</strong>
        <ul className="mt-1 ml-4 space-y-0.5 list-disc">
          <li>Valid, unexpired ID with clear photos</li>
          <li>Proof of residency showing current address</li>
          <li>Documents less than 6 months old (except IDs)</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};
