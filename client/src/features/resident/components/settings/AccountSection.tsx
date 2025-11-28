/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDeleteAccount } from "@/features/resident/hooks";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InfoIcon, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function AccountSection() {
  const { data: user } = useAuth();
  const deleteAccountMutation = useDeleteAccount();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
  });

  const isGoogleUser = user?.authProvider === "google" || false;

  const validateForm = () => {
    const errors = {
      password: "",
    };
    let isValid = true;

    // Validate password for non-Google users
    if (!isGoogleUser && !deleteFormData.password) {
      errors.password = "Password is required to delete your account";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleDeleteAccount = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync({
        password: isGoogleUser ? undefined : deleteFormData.password,
        emailConfirmation: user?.email || "",
        confirmationText: "DELETE",
      });

      toast.success("Account deleted successfully", {
        description: "Your account has been permanently deleted.",
      });
    } catch (error: any) {
      toast.error("Failed to delete account", {
        description: error.message || "Please try again.",
      });
    }
  };

  const resetForm = () => {
    setDeleteFormData({
      password: "",
    });
    setFormErrors({
      password: "",
    });
  };

  const handleDialogChange = (open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Account</h3>
        <Separator />
      </div>
      
      {isGoogleUser && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            You're signed in with Google. Some account settings are managed through your Google account.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Email Address</Label>
          <p className="text-sm text-foreground">{user?.email || "Not available"}</p>
        </div>

        <div className="space-y-2">
          <Label>Account Status</Label>
          <div className="flex items-center gap-2">
            <Badge variant={user?.isEmailVerified ? "default" : "destructive"}>
              {user?.isEmailVerified ? "Email Verified" : "Email Not Verified"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Delete Account</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete your account and all data
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={handleDialogChange}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold text-destructive">
                This action cannot be undone!
              </p>
              <p>
                This will permanently delete your account and remove all your data
                from our servers, including personal information, verification documents,
                request history, and all associated data.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {!isGoogleUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="delete-password">
                  Confirm your password
                </Label>
                <Input
                  id="delete-password"
                  type="password"
                  placeholder="Enter your password"
                  value={deleteFormData.password}
                  onChange={(e) =>
                    setDeleteFormData({ ...deleteFormData, password: e.target.value })
                  }
                  className={formErrors.password ? "border-destructive" : ""}
                  autoFocus
                />
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
