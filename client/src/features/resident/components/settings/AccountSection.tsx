import { useAuth } from "@/features/auth/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function AccountSection() {
  const { data: user } = useAuth();

  const isGoogleUser = user?.isGoogleUser || false;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Account</h3>
        <p className="text-sm text-muted-foreground mt-1">
          View your account information and authentication method
        </p>
      </div>
      
      {isGoogleUser && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            You're signed in with Google. Some account settings are managed through your Google account.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Your email address is used for authentication and cannot be changed.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Account Type</Label>
          <div className="flex items-center gap-2">
            <Badge variant={isGoogleUser ? "default" : "secondary"}>
              {isGoogleUser ? "Google Account" : "Local Account"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Account Status</Label>
          <div className="flex items-center gap-2">
            <Badge variant={user?.isEmailVerified ? "default" : "destructive"}>
              {user?.isEmailVerified ? "Email Verified" : "Email Not Verified"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={user?.id || ""}
            disabled
            className="bg-muted font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Your unique user identifier in the system.
          </p>
        </div>
      </div>
    </div>
  );
}
