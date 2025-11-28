import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationDetailDialogProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationDetailDialog({
  notification,
  open,
  onOpenChange,
  onDelete,
}: NotificationDetailDialogProps) {
  if (!notification) return null;

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          iconColor: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-800",
        };
      case "error":
        return {
          icon: AlertCircle,
          iconColor: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800",
        };
      case "warning":
        return {
          icon: AlertCircle,
          iconColor: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
        };
      default:
        return {
          icon: Info,
          iconColor: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
    }
  };

  const config = getTypeConfig(notification.type);
  const Icon = config.icon;

  const handleClose = () => {
    // Close dialog (already marked as read when opened)
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={cn(
                  "rounded-full p-2 mt-1",
                  config.bgColor,
                  "border",
                  config.borderColor
                )}
              >
                <Icon className={cn("h-5 w-5", config.iconColor)} />
              </div>
              <div className="flex-1 space-y-1">
                <DialogTitle className="text-lg font-semibold leading-tight">
                  {notification.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Full Message */}
        <div className="py-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          {onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
