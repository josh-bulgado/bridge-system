import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useChangePassword } from "../../hooks/useChangePassword";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, ShieldCheck, InfoIcon } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function SecuritySection() {
  const { data: user } = useAuth();
  const changePassword = useChangePassword();

  const isGoogleUser = user?.isGoogleUser || false;

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Security</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password and security settings
        </p>
      </div>

      {isGoogleUser ? (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            You're signed in with Google. Password management is handled through your Google account.
            Visit your{" "}
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100"
            >
              Google Account Security
            </a>{" "}
            page to manage your password.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Change Password</h4>
            <p className="text-xs text-muted-foreground">
              Update your password regularly to keep your account secure
            </p>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="w-full"
                  >
                    {changePassword.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Change Password
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {/* Password Requirements */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Password Requirements</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              Contains at least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              Contains at least one lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              Contains at least one number
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              Contains at least one special character
            </li>
          </ul>
      </div>
    </div>
  );
}
