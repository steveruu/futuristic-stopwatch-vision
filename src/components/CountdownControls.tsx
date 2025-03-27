import React, { useState } from "react";
import {
    Play,
    Pause,
    RotateCcw,
    Clock,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownControlsProps {
    isRunning: boolean;
    hasTime: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
}

const CountdownControls: React.FC<CountdownControlsProps> = ({
    isRunning,
    hasTime,
    onStart,
    onPause,
    onReset,
}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in-delayed">
            <div className="flex items-center justify-center gap-6 md:gap-8 mt-6">
                <button
                    onClick={onReset}
                    className={cn(
                        "control-button",
                        "opacity-70 hover:opacity-100",
                        "transition-opacity duration-300",
                        hasTime || isRunning ? "visible" : "invisible"
                    )}
                    aria-label="Reset countdown"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>

                <button
                    onClick={isRunning ? onPause : onStart}
                    className={cn(
                        "control-button",
                        "w-20 h-20 md:w-24 md:h-24",
                        isRunning
                            ? "bg-white/20 hover:bg-white/30 border-rose-500/30"
                            : "bg-white/20 hover:bg-white/30 border-emerald-500/30",
                        !hasTime &&
                            !isRunning &&
                            "opacity-50 pointer-events-none"
                    )}
                    disabled={!hasTime && !isRunning}
                    aria-label={
                        isRunning ? "Pause countdown" : "Start countdown"
                    }
                >
                    {isRunning ? (
                        <Pause className="w-8 h-8" />
                    ) : (
                        <Play className="w-8 h-8 ml-1" />
                    )}
                </button>

                <div className="w-10 h-10 md:w-12 md:h-12 opacity-0">
                    <RotateCcw className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default CountdownControls;
