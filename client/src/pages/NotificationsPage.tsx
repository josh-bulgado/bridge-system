import { useState } from "react";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notification";
import {
  Bell,
  Check,
  Trash2,
  CheckCircle2,
  Info,
  AlertCircle,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationDetailDialog } from "@/components/notification-detail-dialog";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (notification: Notification) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
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
    onClick(notification);
  };

  const config = getTypeConfig(notification.type);
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "group relative cursor-pointer rounded-lg border-l-4 transition-all duration-200",
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
    </Card>
  );
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationCenter();

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setDialogOpen(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  return (
    <>
      <NotificationDetailDialog
        notification={selectedNotification}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-9 w-9"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6" />
                  <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-sm text-muted-foreground">
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                        : "All caught up!"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter */}
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>

                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAllAsRead()}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-4xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="border-primary mb-3 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
                <p className="text-muted-foreground text-sm">
                  Loading notifications...
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-muted/60 mb-4 rounded-full p-6">
                  <Bell className="text-muted-foreground/60 h-12 w-12" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {filter === "unread"
                    ? "No unread notifications"
                    : filter === "read"
                      ? "No read notifications"
                      : "No notifications yet"}
                </h3>
                <p className="text-muted-foreground max-w-[400px] text-sm leading-relaxed">
                  {filter === "unread"
                    ? "You're all caught up! Check back later for new updates."
                    : filter === "read"
                      ? "You haven't read any notifications yet."
                      : "We'll notify you when something important happens, like verification updates or document status changes."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationsPage;
