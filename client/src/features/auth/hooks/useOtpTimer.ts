import { useState, useEffect, useRef } from 'react';

interface UseOtpTimerReturn {
  timeRemaining: number;
  isExpired: boolean;
  resetTimer: (duration?: number) => void;
  formatTime: (seconds: number) => string;
}

export const useOtpTimer = (initialDuration: number = 600): UseOtpTimerReturn => {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = (duration: number = initialDuration) => {
    setTimeRemaining(duration);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
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
  }, [timeRemaining]);

  return {
    timeRemaining,
    isExpired: timeRemaining === 0,
    resetTimer,
    formatTime,
  };
};