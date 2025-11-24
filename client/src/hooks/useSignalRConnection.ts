import { useState, useEffect } from 'react';
import { getConnection } from '@/lib/signalr';
import * as signalR from '@microsoft/signalr';

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

export const useSignalRConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    const checkConnection = () => {
      const connection = getConnection();
      
      if (!connection) {
        setStatus('disconnected');
        return;
      }

      const state = connection.state;
      
      if (state === signalR.HubConnectionState.Connected) {
        setStatus('connected');
      } else if (state === signalR.HubConnectionState.Reconnecting) {
        setStatus('reconnecting');
      } else {
        setStatus('disconnected');
      }
    };

    // Check immediately
    checkConnection();

    // Check periodically
    const interval = setInterval(checkConnection, 2000);

    return () => clearInterval(interval);
  }, []);

  return status;
};
