import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import FullscreenButton from "./FullscreenButton";
import { ArrowUp, ArrowDown } from "lucide-react";

interface CountdownDisplayProps {
    time: string;
    isRunning: boolean;
    onIncrementMinutes: () => void;
    onDecrementMinutes: () => void;
    onIncrementSeconds: () => void;
    onDecrementSeconds: () => void;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
    time,
    isRunning,
    onIncrementMinutes,
    onDecrementMinutes,
    onIncrementSeconds,
    onDecrementSeconds,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Split time into parts for individual styling
    const [minutes, secondsPart] = time.split(":");
    const [seconds, centiseconds] = secondsPart.split(".");

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
    }, []);

    // Helper component for time unit display with arrows
    const TimeUnitDisplay = ({
        value,
        onIncrement,
        onDecrement,
    }: {
        value: string;
        onIncrement: () => void;
        onDecrement: () => void;
    }) => (
        <div className="relative flex flex-col items-center justify-center group">
            {/* Increment Button (only show when not running and hovered/focused) */}
            {!isRunning && (
                <button
                    onClick={onIncrement}
                    className="absolute -top-8 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 hover:!opacity-100 focus:!opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10"
                    aria-label={`Increase ${value}`}
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
            {/* Value */}
            <span className="inline-block min-w-[1.2ch] text-right">
                {value}
            </span>
            {/* Decrement Button (only show when not running and hovered/focused) */}
            {!isRunning && (
                <button
                    onClick={onDecrement}
                    className="absolute -bottom-8 opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 hover:!opacity-100 focus:!opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10"
                    aria-label={`Decrease ${value}`}
                >
                    <ArrowDown className="w-5 h-5" />
                </button>
            )}
        </div>
    );

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex flex-col items-center justify-center w-full animate-fade-in pt-8 pb-8",
                isFullscreen && "fixed inset-0 bg-background z-50"
            )}
        >
            <div
                className={cn(
                    "font-mono tracking-tight leading-none transition-all duration-300 flex items-center",
                    isFullscreen
                        ? "text-[20vh]"
                        : "text-8xl md:text-9xl lg:text-[10rem]",
                    isRunning ? "text-glow-strong" : "text-glow-subtle"
                )}
            >
                {/* Minutes with Arrows */}
                <TimeUnitDisplay
                    value={minutes}
                    onIncrement={onIncrementMinutes}
                    onDecrement={onDecrementMinutes}
                />
                {/* Colon Separator */}
                <span
                    className={cn(
                        "mx-1 opacity-80 tabular-nums",
                        isRunning && "animate-pulse-subtle",
                        "self-center"
                    )}
                >
                    :
                </span>
                {/* Seconds with Arrows */}
                <TimeUnitDisplay
                    value={seconds}
                    onIncrement={onIncrementSeconds}
                    onDecrement={onDecrementSeconds}
                />
                {/* Centiseconds */}
                <span
                    className={cn(
                        "align-top ml-2 opacity-70 inline-block min-w-[1.5ch] text-left tabular-nums",
                        isFullscreen
                            ? "text-[10vh]"
                            : "text-5xl md:text-6xl lg:text-7xl",
                        "self-start pt-[0.1em]"
                    )}
                >
                    .{centiseconds}
                </span>
            </div>

            <div className="text-muted-foreground font-mono text-sm tracking-widest uppercase mt-12">
                {isRunning ? "Counting Down" : "Paused"}
            </div>

            <FullscreenButton
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                className="absolute bottom-8 right-8"
            />
        </div>
    );
};

export default CountdownDisplay;
