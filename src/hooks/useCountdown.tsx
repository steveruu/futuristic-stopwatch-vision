import { useState, useRef, useEffect, useCallback } from "react";

export function useCountdown() {
    const [timeLeft, setTimeLeft] = useState<number>(0); // Time remaining in ms
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [initialDuration, setInitialDuration] = useState<number>(0); // Store the last set duration
    const intervalRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null); // Stores the Unix timestamp when the countdown should end

    // Effect to initialize state from localStorage
    useEffect(() => {
        const storedEndTimeUnix = localStorage.getItem("countdownEndTimeUnix");
        const storedPausedTimeLeft = localStorage.getItem(
            "countdownPausedTimeLeft"
        );
        const storedTargetDuration = localStorage.getItem(
            "countdownTargetDuration"
        );
        let duration = 0;

        if (storedTargetDuration) {
            duration = parseInt(storedTargetDuration, 10);
            setInitialDuration(duration); // Store for reset
        }

        if (storedEndTimeUnix) {
            // Countdown was running
            const endTime = parseInt(storedEndTimeUnix, 10);
            const currentTimeLeft = endTime - Date.now();
            endTimeRef.current = endTime; // Restore end time ref

            if (currentTimeLeft > 0) {
                setTimeLeft(currentTimeLeft);
                setIsRunning(true);
                // Start interval to continue countdown
                intervalRef.current = window.setInterval(() => {
                    const newTimeLeft = endTimeRef.current! - Date.now();
                    if (newTimeLeft <= 0) {
                        setTimeLeft(0); // Or newTimeLeft to show negative
                        setIsRunning(false);
                        if (intervalRef.current)
                            clearInterval(intervalRef.current);
                        localStorage.removeItem("countdownEndTimeUnix");
                        // Optionally notify completion here
                    } else {
                        setTimeLeft(newTimeLeft);
                    }
                }, 10);
            } else {
                // Countdown finished while away
                setTimeLeft(currentTimeLeft); // Show the negative time or 0
                setIsRunning(false);
                localStorage.removeItem("countdownEndTimeUnix");
                localStorage.removeItem("countdownPausedTimeLeft");
            }
        } else if (storedPausedTimeLeft) {
            // Countdown was paused
            setTimeLeft(parseInt(storedPausedTimeLeft, 10));
            setIsRunning(false);
        } else if (duration > 0) {
            // Only duration was set, not started
            setTimeLeft(duration);
            setIsRunning(false);
        }

        // Cleanup function for the interval when component unmounts or dependencies change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // Run only on mount

    // Format time as MM:SS.cc
    const formatTime = (timeInMs: number): string => {
        const isNegative = timeInMs < 0;
        const absTime = Math.abs(timeInMs);

        const minutes = Math.floor(absTime / 60000);
        const seconds = Math.floor((absTime % 60000) / 1000);
        const centiseconds = Math.floor((absTime % 1000) / 10);

        const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;

        return isNegative ? `-${formattedTime}` : formattedTime;
    };

    const formattedTimeLeft = formatTime(timeLeft);

    const start = useCallback(() => {
        if (isRunning || timeLeft <= 0) return;

        setIsRunning(true);
        const startTime = Date.now();
        const newEndTime = startTime + timeLeft;
        endTimeRef.current = newEndTime;

        localStorage.setItem("countdownEndTimeUnix", String(newEndTime));
        localStorage.setItem(
            "countdownTargetDuration",
            String(initialDuration > 0 ? initialDuration : timeLeft)
        ); // Save the duration that was started with
        localStorage.removeItem("countdownPausedTimeLeft");

        intervalRef.current = window.setInterval(() => {
            const currentTimeLeft = endTimeRef.current! - Date.now();

            if (currentTimeLeft <= 0) {
                setTimeLeft(0);
                setIsRunning(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
                localStorage.removeItem("countdownEndTimeUnix");
            } else {
                setTimeLeft(currentTimeLeft);
            }
        }, 10);
    }, [isRunning, timeLeft, initialDuration]);

    const pause = useCallback(() => {
        if (!isRunning) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsRunning(false);
        localStorage.setItem("countdownPausedTimeLeft", String(timeLeft));
        localStorage.removeItem("countdownEndTimeUnix");
    }, [isRunning, timeLeft]);

    const reset = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setIsRunning(false);
        setTimeLeft(initialDuration); // Reset to the last set duration
        endTimeRef.current = null;
        localStorage.removeItem("countdownEndTimeUnix");
        localStorage.removeItem("countdownPausedTimeLeft");
    }, [initialDuration]);

    const setTime = useCallback(
        (minutes: number, seconds: number) => {
            if (isRunning) return;

            const newTimeInMs = (minutes * 60 + seconds) * 1000;
            setTimeLeft(newTimeInMs);
            setInitialDuration(newTimeInMs); // Update the duration for reset
            localStorage.setItem(
                "countdownTargetDuration",
                String(newTimeInMs)
            );
            localStorage.removeItem("countdownEndTimeUnix");
            localStorage.removeItem("countdownPausedTimeLeft");
        },
        [isRunning]
    );

    return {
        timeLeft,
        formattedTimeLeft,
        isRunning,
        start,
        pause,
        reset,
        setTime,
    };
}
