
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, ArrowUp, ArrowDown } from 'lucide-react';
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
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (minutes > 0 || seconds > 0) {
      onSetTime(minutes, seconds);
      setShowTimeInput(false);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const incrementMinutes = () => {
    setMinutes(prev => Math.min(99, prev + 1));
  };

  const decrementMinutes = () => {
    setMinutes(prev => Math.max(0, prev - 1));
  };

  const incrementSeconds = () => {
    setSeconds(prev => {
      if (prev >= 59) {
        incrementMinutes();
        return 0;
      }
      return prev + 1;
    });
  };

  const decrementSeconds = () => {
    setSeconds(prev => {
      if (prev <= 0 && minutes > 0) {
        decrementMinutes();
        return 59;
      }
      return Math.max(0, prev - 1);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in-delayed">
      {showTimeInput ? (
        <form onSubmit={handleTimeSubmit} className="flex flex-col items-center gap-4 mt-6 w-full max-w-xs glassmorphic p-4 rounded-xl">
          <div className="text-sm font-mono uppercase text-muted-foreground mb-2">Set Countdown Time</div>
          
          <div className="flex gap-6 w-full justify-center">
            {/* Minutes Input with arrows */}
            <div className="flex flex-col items-center">
              <button 
                type="button"
                onClick={incrementMinutes}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Increase minutes"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col relative">
                <div className="text-center font-mono text-3xl py-2 px-3 w-20 bg-black/30 border border-white/10 rounded">
                  {String(minutes).padStart(2, '0')}
                </div>
                <span className="text-xs text-muted-foreground mt-1 text-center">Minutes</span>
              </div>
              
              <button 
                type="button"
                onClick={decrementMinutes}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Decrease minutes"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
            
            {/* Seconds Input with arrows */}
            <div className="flex flex-col items-center">
              <button 
                type="button"
                onClick={incrementSeconds}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Increase seconds"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col relative">
                <div className="text-center font-mono text-3xl py-2 px-3 w-20 bg-black/30 border border-white/10 rounded">
                  {String(seconds).padStart(2, '0')}
                </div>
                <span className="text-xs text-muted-foreground mt-1 text-center">Seconds</span>
              </div>
              
              <button 
                type="button"
                onClick={decrementSeconds}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Decrease seconds"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              type="submit" 
              className="px-4 py-2 glassmorphic rounded-lg hover:bg-white/10 transition-colors"
            >
              Set Time
            </button>
            <button 
              type="button" 
              onClick={() => {
                setShowTimeInput(false);
                setMinutes(0);
                setSeconds(0);
              }}
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
