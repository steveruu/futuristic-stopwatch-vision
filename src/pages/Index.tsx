
import React from 'react';
import StopwatchDisplay from '@/components/StopwatchDisplay';
import StopwatchControls from '@/components/StopwatchControls';
import LapTimes from '@/components/LapTimes';
import { useStopwatch } from '@/hooks/useStopwatch';

const Index = () => {
  const { 
    formattedTime, 
    isRunning, 
    laps, 
    start, 
    stop, 
    reset, 
    lap, 
    formattedLaps 
  } = useStopwatch();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4">
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        {/* Main display */}
        <StopwatchDisplay 
          time={formattedTime} 
          isRunning={isRunning} 
        />
        
        {/* Controls */}
        <StopwatchControls 
          isRunning={isRunning}
          hasLaps={laps.length > 0}
          onStart={start}
          onStop={stop}
          onReset={reset}
          onLap={lap}
        />
      </div>
      
      {/* Lap times */}
      <div className="w-full max-w-4xl mt-auto">
        <LapTimes laps={formattedLaps.reverse()} />
      </div>
    </div>
  );
};

export default Index;
