
import { useState, useRef, useEffect } from 'react';

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [targetTime, setTargetTime] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Format time as MM:SS.cc
  const formatTime = (timeInMs: number): string => {
    const isNegative = timeInMs < 0;
    const absTime = Math.abs(timeInMs);
    
    const minutes = Math.floor(absTime / 60000);
    const seconds = Math.floor((absTime % 60000) / 1000);
    const centiseconds = Math.floor((absTime % 1000) / 10);
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    
    return isNegative ? `-${formattedTime}` : formattedTime;
  };

  const formattedTimeLeft = formatTime(timeLeft);
  
  const start = () => {
    if (isRunning || timeLeft <= 0) return;
    
    setIsRunning(true);
    const startTime = Date.now();
    const newTargetTime = startTime + timeLeft;
    setTargetTime(newTargetTime);
    
    intervalRef.current = window.setInterval(() => {
      const currentTimeLeft = newTargetTime - Date.now();
      
      if (currentTimeLeft <= 0) {
        setTimeLeft(0);
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setTimeLeft(currentTimeLeft);
      }
    }, 10);
  };
  
  const pause = () => {
    if (!isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };
  
  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setTimeLeft(0);
  };
  
  const setTime = (minutes: number, seconds: number) => {
    if (isRunning) return;
    
    const newTimeInMs = (minutes * 60 + seconds) * 1000;
    setTimeLeft(newTimeInMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    timeLeft,
    formattedTimeLeft,
    isRunning,
    start,
    pause,
    reset,
    setTime
  };
}
