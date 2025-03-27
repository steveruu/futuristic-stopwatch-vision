import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullscreenButtonProps {
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    className?: string;
}

const FullscreenButton: React.FC<FullscreenButtonProps> = ({
    isFullscreen,
    onToggleFullscreen,
    className,
}) => {
    return (
        <button
            onClick={onToggleFullscreen}
            className={cn(
                "control-button",
                "opacity-70 hover:opacity-100",
                "transition-opacity duration-300",
                className
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
            {isFullscreen ? (
                <Minimize2 className="w-6 h-6" />
            ) : (
                <Maximize2 className="w-6 h-6" />
            )}
        </button>
    );
};

export default FullscreenButton;
