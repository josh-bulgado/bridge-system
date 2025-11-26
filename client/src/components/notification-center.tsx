import { Bell, Check, Trash2, CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-green-600 dark:text-green-400',
          titleColor: 'text-green-700 dark:text-green-300',
          bgColor: 'bg-green-50/50 dark:bg-green-950/20',
          hoverBgColor: 'hover:bg-green-50 dark:hover:bg-green-950/30',
          borderColor: 'border-green-200/50 dark:border-green-800/50',
          accentColor: 'border-l-green-500',
        };
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-600 dark:text-red-400',
          titleColor: 'text-red-700 dark:text-red-300',
          bgColor: 'bg-red-50/50 dark:bg-red-950/20',
          hoverBgColor: 'hover:bg-red-50 dark:hover:bg-red-950/30',
          borderColor: 'border-red-200/50 dark:border-red-800/50',
          accentColor: 'border-l-red-500',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          titleColor: 'text-yellow-700 dark:text-yellow-300',
          bgColor: 'bg-yellow-50/50 dark:bg-yellow-950/20',
          hoverBgColor: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/30',
          borderColor: 'border-yellow-200/50 dark:border-yellow-800/50',
          accentColor: 'border-l-yellow-500',
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-600 dark:text-blue-400',
          titleColor: 'text-blue-700 dark:text-blue-300',
          bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
          hoverBgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
          borderColor: 'border-blue-200/50 dark:border-blue-800/50',
          accentColor: 'border-l-blue-500',
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
        'group relative rounded-lg border-l-4 transition-all duration-200 cursor-pointer',
        'min-h-[60px]', // Ensure minimum touch target height
        config.accentColor,
        notification.isRead
          ? 'bg-background hover:bg-muted/30 border-t border-r border-b border-border/40'
          : cn(
              config.bgColor,
              config.hoverBgColor,
              'border-t border-r border-b',
              config.borderColor,
              'shadow-sm'
            )
      )}
      onClick={handleClick}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
      
      <div className="flex items-start gap-3 p-4 pr-8">
        {/* Status Icon */}
        <div className={cn(
          'flex-shrink-0 rounded-full p-1.5 mt-0.5',
          notification.isRead 
            ? 'bg-muted/60' 
            : 'bg-background/80 shadow-sm'
        )}>
          <Icon className={cn('h-4 w-4', config.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Title */}
          <h4 className={cn(
            'text-sm leading-tight',
            notification.isRead 
              ? 'font-medium text-foreground' 
              : 'font-semibold',
            config.titleColor
          )}>
            {notification.title}
          </h4>
          
          {/* Message */}
          <p className={cn(
            'text-sm leading-relaxed line-clamp-2',
            notification.isRead
              ? 'text-muted-foreground'
              : 'text-foreground/80'
          )}>
            {notification.message}
          </p>
          
          {/* Timestamp and Actions */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground/80">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            
            {/* Action Buttons - Show on hover */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-background/60"
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
                className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
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
          className="relative hover:bg-muted"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold shadow-sm"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[420px] p-0 shadow-lg border-border/50" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">Notifications</h3>
              {unreadCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="h-5 px-2 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/15"
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
                className="text-xs h-8 px-3 hover:bg-muted font-medium text-muted-foreground hover:text-foreground"
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Mark all read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
        
        {/* Notification List */}
        <ScrollArea className="h-[460px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-3" />
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="rounded-full bg-muted/60 p-4 mb-4">
                <Bell className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h4 className="text-sm font-semibold mb-1.5">No notifications yet</h4>
              <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
                We'll notify you when something important happens, like verification updates or document status changes
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-1.5">
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
            <div className="p-2 bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-9 text-xs font-medium hover:bg-background"
                onClick={() => {
                  // TODO: Navigate to full notifications page if you have one
                  console.log('View all notifications');
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
