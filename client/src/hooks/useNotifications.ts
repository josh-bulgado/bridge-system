import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { startConnection, stopConnection, getConnection } from '@/lib/signalr';
import type { RealtimeNotification } from '@/types/notification';
import * as signalR from '@microsoft/signalr';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const reconnectToastId = useRef<string | number | undefined>();

  const handleNotification = useCallback((notification: RealtimeNotification) => {
    const { title, message, type, actionUrl, category } = notification;
    
    const toastOptions = {
      description: message,
      duration: type === 'error' ? 6000 : 4000,
      ...(actionUrl && {
        action: {
          label: 'View',
          onClick: () => {
            window.location.href = actionUrl;
          },
        },
      }),
    };

    switch (type) {
      case 'success':
        toast.success(title, toastOptions);
        break;
      case 'error':
        toast.error(title, toastOptions);
        break;
      case 'warning':
        toast.warning(title, toastOptions);
        break;
      default:
        toast.info(title, toastOptions);
    }

    // Invalidate notification queries to update the notification bell
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    
    // If verification status changed, invalidate verification status query
    if (category === 'verification') {
      queryClient.invalidateQueries({ queryKey: ['verification-status'] });
      
      // If verification was approved, reload the page after a short delay to update UI
      if (title.includes('Approved')) {
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Give user time to see the notification
      }
    }
  }, [queryClient]);

  useEffect(() => {
    const accessToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!accessToken) {
      return;
    }

    let isMounted = true;

    const initializeConnection = async () => {
      try {
        const connection = await startConnection(accessToken);
        
        if (connection && isMounted) {
          connection.on('ReceiveNotification', handleNotification);

          // Handle reconnecting state
          connection.onreconnecting(() => {
            if (isMounted) {
              reconnectToastId.current = toast.loading('Reconnecting to notifications...', {
                duration: Infinity,
              });
            }
          });

          // Handle successful reconnection
          connection.onreconnected(() => {
            if (isMounted) {
              if (reconnectToastId.current) {
                toast.dismiss(reconnectToastId.current);
              }
              toast.success('Connected! Real-time notifications active', {
                duration: 3000,
              });
              // Refresh notifications after reconnection
              queryClient.invalidateQueries({ queryKey: ['notifications'] });
              queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
            }
          });

          // Handle connection close
          connection.onclose(() => {
            if (isMounted && reconnectToastId.current) {
              toast.dismiss(reconnectToastId.current);
            }
          });
        }
      } catch (error) {
        // Silent fail - connection will auto-retry
      }
    };

    initializeConnection();

    return () => {
      isMounted = false;
      const connection = getConnection();
      if (connection) {
        connection.off('ReceiveNotification', handleNotification);
      }
      // Don't stop connection on unmount - keep it alive for the session
      // stopConnection();
    };
  }, [handleNotification]);
};
