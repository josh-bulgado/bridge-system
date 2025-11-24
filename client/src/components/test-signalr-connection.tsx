import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getConnection } from '@/lib/signalr';
import api from '@/lib/api';
import { toast } from 'sonner';

export const TestSignalRConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [lastTestResult, setLastTestResult] = useState<any>(null);

  const checkConnection = () => {
    const connection = getConnection();
    
    if (!connection) {
      setConnectionStatus('disconnected');
      setConnectionId(null);
      return;
    }

    const state = connection.state;
    
    if (state === 'Connected') {
      setConnectionStatus('connected');
      setConnectionId(connection.connectionId || null);
    } else {
      setConnectionStatus('disconnected');
      setConnectionId(null);
    }
  };

  const sendTestNotification = async () => {
    try {
      const response = await api.post('/api/notification/test');
      setLastTestResult(response.data);
      toast.success('Test notification sent!', {
        description: 'Check if you received a notification via SignalR'
      });
    } catch (error: any) {
      toast.error('Failed to send test notification', {
        description: error.response?.data?.error || error.message
      });
    }
  };

  // Check connection on mount and when button is clicked
  useState(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    return () => clearInterval(interval);
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔌 SignalR Connection Test
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            {connectionStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Test the SignalR connection with JWT authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-medium">Connection Status:</span>
            <span className={connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus.toUpperCase()}
            </span>
          </div>
          
          {connectionId && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Connection ID:</span>
              <code className="text-xs bg-black/10 px-2 py-1 rounded">{connectionId}</code>
            </div>
          )}

          {lastTestResult && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <span className="font-medium">Last Test Result:</span>
              <div className="text-sm space-y-1">
                <div>User ID: <code className="bg-black/10 px-2 py-1 rounded">{lastTestResult.userId}</code></div>
                <div>User Name: <strong>{lastTestResult.userName}</strong></div>
                <div>Role: <Badge variant="outline">{lastTestResult.role}</Badge></div>
                <div>Timestamp: {new Date(lastTestResult.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={checkConnection} variant="outline">
            Refresh Status
          </Button>
          <Button 
            onClick={sendTestNotification} 
            disabled={connectionStatus !== 'connected'}
          >
            Send Test Notification
          </Button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Verify the connection status shows "CONNECTED"</li>
            <li>Click "Send Test Notification" button</li>
            <li>You should see a toast notification appear via SignalR</li>
            <li>Open browser DevTools Console to see SignalR logs</li>
          </ol>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
            <li>If disconnected, try refreshing the page</li>
            <li>Check browser console for connection errors</li>
            <li>Verify JWT token exists in localStorage/sessionStorage</li>
            <li>Ensure the server is running on the correct port</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
