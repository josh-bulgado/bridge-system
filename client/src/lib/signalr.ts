import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const startConnection = async (accessToken: string) => {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  // SignalR hub is at the root level, not under /api
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const baseUrl = apiUrl.replace('/api', ''); // Remove /api suffix if present
  const hubUrl = `${baseUrl}/notificationHub`;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Exponential backoff: 0s, 2s, 10s, 30s
        if (retryContext.elapsedMilliseconds < 60000) {
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        }
        return null; // Stop reconnecting after 1 minute
      }
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.onreconnecting(() => {
    // Reconnecting in progress
  });

  connection.onreconnected(() => {
    // Reconnected successfully
  });

  connection.onclose(() => {
    // Connection closed
  });

  try {
    await connection.start();
    return connection;
  } catch (err) {
    throw err;
  }
};

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};

export const getConnection = () => connection;
