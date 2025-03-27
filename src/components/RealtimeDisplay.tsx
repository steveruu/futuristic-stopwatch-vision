import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FullscreenButton from "./FullscreenButton";

// Define the structure of timeParts
interface TimeParts {
    hours: string;
    minutes: string;
    seconds: string;
    ampm: string | null;
}

interface RealtimeDisplayProps {
    // Remove 'time' prop, replace with 'timeParts'
    timeParts: TimeParts;
    is24Hour: boolean;
    onToggleFormat: () => void;
}

const RealtimeDisplay: React.FC<RealtimeDisplayProps> = ({
    timeParts, // Use timeParts
    is24Hour,
    onToggleFormat,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const { hours, minutes, seconds, ampm } = timeParts; // Destructure parts

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
                "w-full flex flex-col items-center justify-center my-12 md:my-16 lg:my-20 animate-fade-in gap-8",
                isFullscreen && "fixed inset-0 bg-background z-50 my-0"
            )}
        >
            <div
                className={cn(
                    "font-mono tracking-tight text-glow-strong transition-all duration-300",
                    isFullscreen
                        ? "text-[20vh]"
                        : "text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                )}
            >
                {`${hours}:${minutes}:${seconds}`}
                {!is24Hour && (
                    <span
                        className={cn(
                            "opacity-30",
                            isFullscreen
                                ? "text-[10vh] ml-8"
                                : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl ml-4"
                        )}
                    >
                        {ampm}
                    </span>
                )}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={onToggleFormat}
                className={cn(
                    "font-mono",
                    isFullscreen && "absolute bottom-8 left-8"
                )}
            >
                {is24Hour ? "12H" : "24H"}
            </Button>

            <FullscreenButton
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                className="absolute bottom-8 right-8"
            />
        </div>
    );
};

export default RealtimeDisplay;
