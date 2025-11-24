import { useSignalRConnection } from '@/hooks/useSignalRConnection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const ConnectionStatusIndicator = () => {
  const status = useSignalRConnection();

  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
      description: 'Real-time notifications active',
      pulse: false,
    },
    reconnecting: {
      color: 'bg-yellow-500',
      text: 'Reconnecting',
      description: 'Attempting to reconnect...',
      pulse: true,
    },
    disconnected: {
      color: 'bg-red-500',
      text: 'Disconnected',
      description: 'Connection lost. Notifications may be delayed.',
      pulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <div className="relative">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  config.color
                )}
              />
              {config.pulse && (
                <div
                  className={cn(
                    'absolute inset-0 h-2 w-2 rounded-full animate-ping',
                    config.color,
                    'opacity-75'
                  )}
                />
              )}
            </div>
            <span className="text-xs text-muted-foreground sr-only sm:not-sr-only">
              {config.text}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{config.text}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
