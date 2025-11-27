import {
  Bell,
  Check,
  Trash2,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          iconColor: "text-green-600 dark:text-green-400",
          titleColor: "text-green-700 dark:text-green-300",
          bgColor: "bg-green-50/50 dark:bg-green-950/20",
          hoverBgColor: "hover:bg-green-50 dark:hover:bg-green-950/30",
          borderColor: "border-green-200/50 dark:border-green-800/50",
          accentColor: "border-l-green-500",
        };
      case "error":
        return {
          icon: AlertCircle,
          iconColor: "text-red-600 dark:text-red-400",
          titleColor: "text-red-700 dark:text-red-300",
          bgColor: "bg-red-50/50 dark:bg-red-950/20",
          hoverBgColor: "hover:bg-red-50 dark:hover:bg-red-950/30",
          borderColor: "border-red-200/50 dark:border-red-800/50",
          accentColor: "border-l-red-500",
        };
      case "warning":
        return {
          icon: AlertCircle,
          iconColor: "text-yellow-600 dark:text-yellow-400",
          titleColor: "text-yellow-700 dark:text-yellow-300",
          bgColor: "bg-yellow-50/50 dark:bg-yellow-950/20",
          hoverBgColor: "hover:bg-yellow-50 dark:hover:bg-yellow-950/30",
          borderColor: "border-yellow-200/50 dark:border-yellow-800/50",
          accentColor: "border-l-yellow-500",
        };
      default:
        return {
          icon: Info,
          iconColor: "text-blue-600 dark:text-blue-400",
          titleColor: "text-blue-700 dark:text-blue-300",
          bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
          hoverBgColor: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
          borderColor: "border-blue-200/50 dark:border-blue-800/50",
          accentColor: "border-l-blue-500",
        };
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const config = getTypeConfig(notification.type);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg border-l-4 transition-all duration-200",
        "min-h-[60px]", // Ensure minimum touch target height
        config.accentColor,
        notification.isRead
          ? "bg-background hover:bg-muted/30 border-border/40 border-t border-r border-b"
          : cn(
              config.bgColor,
              config.hoverBgColor,
              "border-t border-r border-b",
              config.borderColor,
              "shadow-sm",
            ),
      )}
      onClick={handleClick}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <div className="bg-primary absolute top-3 right-3 h-2 w-2 animate-pulse rounded-full" />
      )}

      <div className="flex items-start gap-3 p-4 pr-8">
        {/* Status Icon */}
        <div
          className={cn(
            "mt-0.5 shrink-0 rounded-full p-1.5",
            notification.isRead ? "bg-muted/60" : "bg-background/80 shadow-sm",
          )}
        >
          <Icon className={cn("h-4 w-4", config.iconColor)} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1">
          {/* Title */}
          <h4
            className={cn(
              "text-sm leading-tight",
              notification.isRead
                ? "text-foreground font-medium"
                : "font-semibold",
              config.titleColor,
            )}
          >
            {notification.title}
          </h4>

          {/* Message */}
          <p
            className={cn(
              "line-clamp-2 text-sm leading-relaxed",
              notification.isRead
                ? "text-muted-foreground"
                : "text-foreground/80",
            )}
          >
            {notification.message}
          </p>

          {/* Timestamp and Actions */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-muted-foreground/80 text-xs">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>

            {/* Action Buttons - Show on hover */}
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-background/60 h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  title="Mark as read"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationCenter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-semibold shadow-sm"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-border/50 w-[420px] p-0 shadow-lg"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="bg-background/95 supports-backdrop-filter:bg-background/80 border-border/50 sticky top-0 z-10 border-b backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/15 h-5 px-2 text-xs font-medium"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                className="hover:bg-muted text-muted-foreground hover:text-foreground h-8 px-3 text-xs font-medium"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <div className="px-4 pb-2">
              <p className="text-muted-foreground text-xs">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {/* Notification List */}
        <ScrollArea className="h-[460px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <div className="border-primary mb-3 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-muted-foreground text-sm">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="bg-muted/60 mb-4 rounded-full p-4">
                <Bell className="text-muted-foreground/60 h-8 w-8" />
              </div>
              <h4 className="mb-1.5 text-sm font-semibold">
                No notifications yet
              </h4>
              <p className="text-muted-foreground max-w-[280px] text-xs leading-relaxed">
                We'll notify you when something important happens, like
                verification updates or document status changes
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 p-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer - Optional: Add "View All" or settings */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="bg-muted/30 p-2">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-background h-9 w-full text-xs font-medium"
                onClick={() => {
                  // TODO: Navigate to full notifications page if you have one
                  console.log("View all notifications");
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
