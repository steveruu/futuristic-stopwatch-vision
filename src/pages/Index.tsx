import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StopwatchDisplay from "@/components/StopwatchDisplay";
import StopwatchControls from "@/components/StopwatchControls";
import LapTimes from "@/components/LapTimes";
import CountdownDisplay from "@/components/CountdownDisplay";
import CountdownControls from "@/components/CountdownControls";
import RealtimeDisplay from "@/components/RealtimeDisplay";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useCountdown } from "@/hooks/useCountdown";
import { useRealtime } from "@/hooks/useRealtime";
import { Timer, Hourglass, Clock } from "lucide-react";

const Index = () => {
    // State for active tab
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "stopwatch";
    });

    // Effect to save active tab to localStorage
    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    // Stopwatch state
    const {
        formattedTime,
        isRunning: isStopwatchRunning,
        laps,
        start: startStopwatch,
        stop: stopStopwatch,
        reset: resetStopwatch,
        lap,
        formattedLaps,
    } = useStopwatch();

    // Countdown state
    const {
        formattedTimeLeft,
        isRunning: isCountdownRunning,
        timeLeft,
        start: startCountdown,
        pause: pauseCountdown,
        reset: resetCountdown,
        setTime,
    } = useCountdown();

    // Realtime clock state - destructure timeParts
    const {
        timeParts, // Get timeParts instead of formattedRealtime
        is24Hour,
        toggleFormat,
    } = useRealtime();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full max-w-4xl"
            >
                <TabsList className="w-full glassmorphic mb-8 border border-white/10 rounded-xl bg-black/40 p-1.5 shadow-md">
                    <TabsTrigger
                        value="stopwatch"
                        className="flex-1 py-2.5 text-gray-400 hover:text-white rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-inner "
                    >
                        <Timer className="mr-2 h-5 w-5" />
                        /stopwatch
                    </TabsTrigger>
                    <TabsTrigger
                        value="countdown"
                        className="flex-1 py-2.5 text-gray-400 hover:text-white rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-inner"
                    >
                        <Hourglass className="mr-2 h-5 w-5" />
                        /countdown
                    </TabsTrigger>
                    <TabsTrigger
                        value="realtime"
                        className="flex-1 py-2.5 text-gray-400 hover:text-white rounded-lg transition-colors duration-200 ease-in-out data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-inner"
                    >
                        <Clock className="mr-2 h-5 w-5" />
                        /realtime
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="stopwatch"
                    className="w-full flex flex-col items-center"
                >
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

                    {/* Lap times - hidden for UI consistency - laptimes don't look good ATM */}
                    {/* <div className="w-full max-w-4xl mt-auto">
                        <LapTimes laps={formattedLaps.reverse()} />
                    </div>
                    */}
                </TabsContent>

                <TabsContent
                    value="countdown"
                    className="w-full flex flex-col items-center"
                >
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

                <TabsContent
                    value="realtime"
                    className="w-full flex flex-col items-center"
                >
                    <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
                        {/* Realtime display - pass timeParts instead of time */}
                        <RealtimeDisplay
                            timeParts={timeParts} // Pass timeParts object
                            is24Hour={is24Hour}
                            onToggleFormat={toggleFormat}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Index;
