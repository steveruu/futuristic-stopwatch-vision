import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import FullscreenButton from "./FullscreenButton";

interface CountdownDisplayProps {
    time: string;
    isRunning: boolean;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
    time,
    isRunning,
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

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex flex-col items-center justify-center w-full animate-fade-in",
                isFullscreen && "fixed inset-0 bg-background z-50"
            )}
        >
            <div
                className={cn(
                    "font-mono tracking-tight leading-none transition-all duration-300",
                    isFullscreen
                        ? "text-[20vh]"
                        : "text-8xl md:text-9xl lg:text-[10rem]",
                    isRunning ? "text-glow-strong" : "text-glow-subtle"
                )}
            >
                <span className="inline-block min-w-[1.2ch] text-right">
                    {minutes}
                </span>
                <span
                    className={cn(
                        "mx-1 opacity-80",
                        isRunning && "animate-pulse-subtle"
                    )}
                >
                    :
                </span>
                <span className="inline-block min-w-[1.2ch] text-right">
                    {seconds}
                </span>
                <span
                    className={cn(
                        "align-top ml-2 opacity-70 inline-block min-w-[1.5ch] text-left",
                        isFullscreen
                            ? "text-[10vh]"
                            : "text-5xl md:text-6xl lg:text-7xl"
                    )}
                >
                    .{centiseconds}
                </span>
            </div>

            <div className="text-muted-foreground font-mono text-sm tracking-widest uppercase mt-4">
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
