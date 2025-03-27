
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownControlsProps {
  isRunning: boolean;
  hasTime: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetTime: (minutes: number, seconds: number) => void;
}

const CountdownControls: React.FC<CountdownControlsProps> = ({
  isRunning,
  hasTime,
  onStart,
  onPause,
  onReset,
  onSetTime
}) => {
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    
    if (mins > 0 || secs > 0) {
      onSetTime(mins, secs);
      setShowTimeInput(false);
      setMinutes('');
      setSeconds('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in-delayed">
      {showTimeInput ? (
        <form onSubmit={handleTimeSubmit} className="flex flex-col items-center gap-4 mt-6 w-full max-w-xs glassmorphic p-4 rounded-xl">
          <div className="text-sm font-mono uppercase text-muted-foreground mb-2">Set Countdown Time</div>
          
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <label htmlFor="minutes" className="text-xs text-muted-foreground mb-1 block">Minutes</label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="99"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 font-mono text-lg focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="seconds" className="text-xs text-muted-foreground mb-1 block">Seconds</label>
              <input
                type="number"
                id="seconds" 
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 font-mono text-lg focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button 
              type="submit" 
              className="px-4 py-2 glassmorphic rounded-lg hover:bg-white/10 transition-colors"
            >
              Set Time
            </button>
            <button 
              type="button" 
              onClick={() => setShowTimeInput(false)}
              className="px-4 py-2 glassmorphic rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-6">
          {/* Reset button */}
          <button 
            onClick={onReset} 
            className={cn(
              "control-button",
              "opacity-70 hover:opacity-100",
              "transition-opacity duration-300",
              hasTime ? "visible" : "invisible"
            )}
            aria-label="Reset countdown"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          {/* Main action button (start/pause) */}
          <button 
            onClick={isRunning ? onPause : onStart} 
            className={cn(
              "control-button",
              "w-20 h-20 md:w-24 md:h-24",
              isRunning 
                ? "bg-white/20 hover:bg-white/30 border-rose-500/30" 
                : "bg-white/20 hover:bg-white/30 border-emerald-500/30",
              !hasTime && "opacity-50 pointer-events-none"
            )}
            disabled={!hasTime}
            aria-label={isRunning ? "Pause countdown" : "Start countdown"}
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
          
          {/* Set Time button */}
          <button 
            onClick={() => setShowTimeInput(true)} 
            className={cn(
              "control-button",
              "opacity-70 hover:opacity-100",
              "transition-opacity duration-300",
              isRunning && "invisible"
            )}
            disabled={isRunning}
            aria-label="Set countdown time"
          >
            <Clock className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CountdownControls;
