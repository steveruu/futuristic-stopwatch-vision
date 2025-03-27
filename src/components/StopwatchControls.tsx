
import React from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StopwatchControlsProps {
  isRunning: boolean;
  hasLaps: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onLap: () => void;
}

const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  isRunning,
  hasLaps,
  onStart,
  onStop,
  onReset,
  onLap
}) => {
  return (
    <div className="flex items-center justify-center gap-6 md:gap-8 mt-10 animate-fade-in-delayed">
      {/* Reset button */}
      <button 
        onClick={onReset} 
        className={cn(
          "control-button",
          "opacity-70 hover:opacity-100",
          "transition-opacity duration-300",
          (isRunning || hasLaps) ? "visible" : "invisible"
        )}
        aria-label="Reset stopwatch"
      >
        <RotateCcw className="w-6 h-6" />
      </button>
      
      {/* Main action button (start/stop) */}
      <button 
        onClick={isRunning ? onStop : onStart} 
        className={cn(
          "control-button",
          "w-20 h-20 md:w-24 md:h-24",
          isRunning 
            ? "bg-white/20 hover:bg-white/30 border-rose-500/30" 
            : "bg-white/20 hover:bg-white/30 border-emerald-500/30"
        )}
        aria-label={isRunning ? "Stop stopwatch" : "Start stopwatch"}
      >
        {isRunning ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>
      
      {/* Lap button */}
      <button 
        onClick={onLap} 
        className={cn(
          "control-button",
          "opacity-70 hover:opacity-100",
          "transition-opacity duration-300",
          isRunning ? "visible" : "invisible"
        )}
        disabled={!isRunning}
        aria-label="Record lap time"
      >
        <Flag className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StopwatchControls;
