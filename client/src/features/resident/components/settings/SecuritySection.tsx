import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { toast } from "sonner";

export function SecuritySection() {
  const { mutate: signOut, isPending } = useSignOut();

  const handleLogout = () => {
    signOut(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
      },
      onError: () => {
        toast.error("Failed to log out");
      },
    });
  };

  const handleLogoutAll = () => {
    // TODO: Implement logout from all devices
    toast.info("Logout from all devices - Coming soon");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Security</h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Log out of this device</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isPending}
          >
            Log out
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Log out of all devices</Label>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogoutAll}
            disabled={isPending}
          >
            Log out of all
          </Button>
        </div>
      </div>
    </div>
  );
}
