
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StopwatchDisplay from '@/components/StopwatchDisplay';
import StopwatchControls from '@/components/StopwatchControls';
import LapTimes from '@/components/LapTimes';
import CountdownDisplay from '@/components/CountdownDisplay';
import CountdownControls from '@/components/CountdownControls';
import { useStopwatch } from '@/hooks/useStopwatch';
import { useCountdown } from '@/hooks/useCountdown';
import { Timer, Hourglass } from 'lucide-react';

const Index = () => {
  // Stopwatch state
  const { 
    formattedTime, 
    isRunning: isStopwatchRunning, 
    laps, 
    start: startStopwatch, 
    stop: stopStopwatch, 
    reset: resetStopwatch, 
    lap, 
    formattedLaps 
  } = useStopwatch();

  // Countdown state
  const {
    formattedTimeLeft,
    isRunning: isCountdownRunning,
    timeLeft,
    start: startCountdown,
    pause: pauseCountdown,
    reset: resetCountdown,
    setTime
  } = useCountdown();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4">
      <Tabs defaultValue="stopwatch" className="w-full max-w-4xl">
        <TabsList className="w-full glassmorphic mb-8 border border-white/10 rounded-xl bg-black/40">
          <TabsTrigger value="stopwatch" className="flex-1 py-3 data-[state=active]:text-glow-subtle data-[state=active]:bg-white/10">
            <Timer className="mr-2 h-5 w-5" />
            Stopwatch
          </TabsTrigger>
          <TabsTrigger value="countdown" className="flex-1 py-3 data-[state=active]:text-glow-subtle data-[state=active]:bg-white/10">
            <Hourglass className="mr-2 h-5 w-5" />
            Countdown
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stopwatch" className="w-full flex flex-col items-center">
          <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
            {/* Stopwatch display */}
            <StopwatchDisplay 
              time={formattedTime} 
              isRunning={isStopwatchRunning} 
            />
            
            {/* Stopwatch controls */}
            <StopwatchControls 
              isRunning={isStopwatchRunning}
              hasLaps={laps.length > 0}
              onStart={startStopwatch}
              onStop={stopStopwatch}
              onReset={resetStopwatch}
              onLap={lap}
            />
          </div>
          
          {/* Lap times */}
          <div className="w-full max-w-4xl mt-auto">
            <LapTimes laps={formattedLaps.reverse()} />
          </div>
        </TabsContent>
        
        <TabsContent value="countdown" className="w-full flex flex-col items-center">
          <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
            {/* Countdown display */}
            <CountdownDisplay 
              time={formattedTimeLeft} 
              isRunning={isCountdownRunning} 
            />
            
            {/* Countdown controls */}
            <CountdownControls 
              isRunning={isCountdownRunning}
              hasTime={timeLeft > 0}
              onStart={startCountdown}
              onPause={pauseCountdown}
              onReset={resetCountdown}
              onSetTime={setTime}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
