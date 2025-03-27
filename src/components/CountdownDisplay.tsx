
import React from 'react';
import { cn } from '@/lib/utils';

interface CountdownDisplayProps {
  time: string;
  isRunning: boolean;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ time, isRunning }) => {
  // Split time into parts for individual styling
  const [minutes, secondsPart] = time.split(':');
  const [seconds, centiseconds] = secondsPart.split('.');

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in">
      <div 
        className={cn(
          "font-mono text-8xl md:text-9xl lg:text-[10rem] tracking-tight leading-none transition-all duration-300",
          isRunning ? "text-glow-strong" : "text-glow-subtle"
        )}
      >
        <span className="inline-block min-w-[1.2ch] text-right">{minutes}</span>
        <span className={cn(
          "mx-1 opacity-80",
          isRunning && "animate-pulse-subtle"
        )}>:</span>
        <span className="inline-block min-w-[1.2ch] text-right">{seconds}</span>
        <span className="text-5xl md:text-6xl lg:text-7xl align-top ml-2 opacity-70 inline-block min-w-[1.5ch] text-left">.{centiseconds}</span>
      </div>
      
      <div className="text-muted-foreground font-mono text-sm tracking-widest uppercase mt-4">
        {isRunning ? 'Counting Down' : 'Paused'}
      </div>
    </div>
  );
};

export default CountdownDisplay;
