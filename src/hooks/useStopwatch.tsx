import { useState, useEffect, useRef, useCallback } from "react";

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

    useEffect(() => {
        const storedStartTimeUnix = localStorage.getItem(
            "stopwatchStartTimeUnix"
        );
        const storedAccumulatedTime = localStorage.getItem(
            "stopwatchTimeAccumulated"
        );
        const storedLaps = localStorage.getItem("stopwatchLaps");

        let initialAccumulatedTime = 0;
        let initialStartTime = 0;
        let shouldBeRunning = false;

        if (storedAccumulatedTime) {
            initialAccumulatedTime = parseInt(storedAccumulatedTime, 10);
            timeAccumulatedRef.current = initialAccumulatedTime;
        }

        if (storedStartTimeUnix) {
            initialStartTime = parseInt(storedStartTimeUnix, 10);
            startTimeRef.current = initialStartTime;
            shouldBeRunning = true;

            const elapsedSinceLastStart = Date.now() - initialStartTime;
            const currentTime = initialAccumulatedTime + elapsedSinceLastStart;
            setTime(currentTime);
        } else {
            setTime(initialAccumulatedTime);
        }

        if (shouldBeRunning) {
            setIsRunning(true);
            intervalRef.current = window.setInterval(() => {
                setTime(
                    timeAccumulatedRef.current +
                        (Date.now() - startTimeRef.current)
                );
            }, 10);
        }

        if (storedLaps) {
            setLaps(JSON.parse(storedLaps));
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const start = useCallback(() => {
        if (isRunning) return;

        setIsRunning(true);
        const now = Date.now();
        startTimeRef.current = now;

        localStorage.setItem(
            "stopwatchStartTimeUnix",
            String(startTimeRef.current)
        );
        localStorage.setItem(
            "stopwatchTimeAccumulated",
            String(timeAccumulatedRef.current)
        );

        intervalRef.current = window.setInterval(() => {
            setTime(
                timeAccumulatedRef.current + (Date.now() - startTimeRef.current)
            );
        }, 10);
    }, [isRunning]);

    const stop = useCallback(() => {
        if (!isRunning) return;

        clearInterval(intervalRef.current!);
        const elapsedLastRun = Date.now() - startTimeRef.current;
        timeAccumulatedRef.current =
            timeAccumulatedRef.current + elapsedLastRun;
        setIsRunning(false);

        localStorage.setItem(
            "stopwatchTimeAccumulated",
            String(timeAccumulatedRef.current)
        );
        localStorage.removeItem("stopwatchStartTimeUnix");
    }, [isRunning]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current!);
        setTime(0);
        setIsRunning(false);
        setLaps([]);
        timeAccumulatedRef.current = 0;
        startTimeRef.current = 0;
        localStorage.removeItem("stopwatchStartTimeUnix");
        localStorage.removeItem("stopwatchTimeAccumulated");
        localStorage.removeItem("stopwatchLaps");
    }, []);

    const lap = useCallback(() => {
        if (isRunning) {
            setLaps((prevLaps) => {
                const newLaps = [...prevLaps, time];
                localStorage.setItem("stopwatchLaps", JSON.stringify(newLaps));
                return newLaps;
            });
        }
    }, [isRunning, time]);

    const formatTime = (timeMs: number): string => {
        const totalCentiseconds = Math.floor(timeMs / 10);
        const minutes = Math.floor(totalCentiseconds / 6000);
        const seconds = Math.floor((totalCentiseconds % 6000) / 100);
        const centiseconds = totalCentiseconds % 100;

        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    };

    const formattedTime = formatTime(time);
    const formattedLaps = laps.map((lapTime) => formatTime(lapTime));

    return {
        time,
        isRunning,
        laps,
        start,
        stop,
        reset,
        lap,
        formattedTime,
        formattedLaps,
    };
};
