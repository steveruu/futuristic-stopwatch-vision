
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseStopwatchReturn {
  time: number;
  isRunning: boolean;
  laps: number[];
  start: () => void;
  stop: () => void;
  reset: () => void;
  lap: () => void;
  formattedTime: string;
  formattedLaps: string[];
}

export const useStopwatch = (): UseStopwatchReturn => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeAccumulatedRef = useRef<number>(0);

  const start = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now() - timeAccumulatedRef.current;
    
    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
      timeAccumulatedRef.current = Date.now() - startTimeRef.current;
    }, 10);
  }, [isRunning]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    
    clearInterval(intervalRef.current!);
    timeAccumulatedRef.current = time;
    setIsRunning(false);
  }, [isRunning, time]);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current!);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    timeAccumulatedRef.current = 0;
  }, []);

  const lap = useCallback(() => {
    if (isRunning) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  }, [isRunning, time]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (timeMs: number): string => {
    const totalCentiseconds = Math.floor(timeMs / 10);
    const minutes = Math.floor(totalCentiseconds / 6000);
    const seconds = Math.floor((totalCentiseconds % 6000) / 100);
    const centiseconds = totalCentiseconds % 100;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const formattedTime = formatTime(time);
  const formattedLaps = laps.map(lapTime => formatTime(lapTime));

  return {
    time,
    isRunning,
    laps,
    start,
    stop,
    reset,
    lap,
    formattedTime,
    formattedLaps
  };
};
