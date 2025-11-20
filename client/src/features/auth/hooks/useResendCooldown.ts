import { useState, useEffect, useRef } from 'react';

interface UseResendCooldownReturn {
  cooldownTime: number;
  isCooldownActive: boolean;
  startCooldown: (duration?: number) => void;
}

export const useResendCooldown = (initialDuration: number = 60): UseResendCooldownReturn => {
  const [cooldownTime, setCooldownTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = (duration: number = initialDuration) => {
    setCooldownTime(duration);
  };

  useEffect(() => {
    if (cooldownTime > 0) {
      intervalRef.current = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cooldownTime]);

  return {
    cooldownTime,
    isCooldownActive: cooldownTime > 0,
    startCooldown,
  };
};