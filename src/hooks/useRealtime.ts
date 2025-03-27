import { useState, useEffect, useCallback, useRef } from 'react';

// Define the structure for time parts
interface TimeParts {
    hours: string;
    minutes: string;
    seconds: string;
    ampm: string | null;
}

// Keep the original formatTime for potential other uses or simpler cases
// Note: This function is currently unused after refactoring but kept for potential future use.
// const formatFullTimeString = (date: Date, is24Hour: boolean): string => {
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
    
//     if (is24Hour) {
//         return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
//     } else {
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12;
//         hours = hours ? hours : 12; // the hour '0' should be '12'
//         return `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
//     }
// };

// Function to get time parts from a Date object
const getTimeParts = (date: Date, is24Hour: boolean): TimeParts => {
    let hoursRaw = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    let hours: string;
    let ampm: string | null = null;

    if (is24Hour) {
        hours = String(hoursRaw).padStart(2, '0');
    } else {
        ampm = hoursRaw >= 12 ? 'PM' : 'AM';
        let hours12 = hoursRaw % 12;
        hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
        hours = String(hours12).padStart(2, '0');
    }
    
    return { hours, minutes, seconds, ampm };
};

// Function to fetch accurate time from timeapi.io based on client IP - fallback to client time if error
const fetchAccurateTime = async (): Promise<number> => {
    try {
        // Get client IP address first
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) {
            throw new Error(`Failed to get IP address: ${ipResponse.status}`);
        }
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;
        
        // Use the IP address in the timeapi.io request
        const response = await fetch(`https://timeapi.io/api/time/current/ip?ipAddress=${ipAddress}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        /* 
        {
  "year": 2025,
  "month": 3,   
  "day": 27,
  "hour": 22,
  "minute": 7,
  "seconds": 31,
  "milliSeconds": 772,
  "dateTime": "2025-03-27T22:07:31.7726984",
  "date": "03/27/2025",
  "time": "22:07",
  "timeZone": "UTC",
  "dayOfWeek": "Thursday",
  "dstActive": false
}*/

        const time = data.dateTime;
        const date = new Date(time);
        return date.getTime();
    } catch (error) {
        console.error("Failed to fetch accurate time:", error);
        // Fallback to client time in case of error
        return Date.now();
    }
};

export const useRealtime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    // Initialize is24Hour from localStorage if available, otherwise default to true
    const [is24Hour, setIs24Hour] = useState(() => {
        const savedFormat = localStorage.getItem('realtimeIs24Hour');
        return savedFormat !== null ? savedFormat === 'true' : true;
    });
    const [timeOffset, setTimeOffset] = useState<number>(0); // Offset between client and server time
    const [isSyncing, setIsSyncing] = useState<boolean>(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Effect to save format preference to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('realtimeIs24Hour', String(is24Hour));
    }, [is24Hour]);

    // Function to synchronize time with the server
    const syncTime = useCallback(async () => {
        setIsSyncing(true);
        const clientTimeBefore = Date.now();
        const serverTimeMillis = await fetchAccurateTime();
        const clientTimeAfter = Date.now();

        // Simple offset calculation: ServerTime - ClientTimeAtFetch
        // A more robust calculation could estimate latency:
        // const latency = (clientTimeAfter - clientTimeBefore) / 2;
        // const adjustedServerTime = serverTimeMillis + latency;
        // const newOffset = adjustedServerTime - clientTimeAfter;
        
        // Using simpler offset for now
        const newOffset = serverTimeMillis - clientTimeAfter; 

        setTimeOffset(newOffset);
        setIsSyncing(false);
        // Update immediately with the new offset
        setCurrentTime(new Date(Date.now() + newOffset));
    }, []);

    // Effect for initial time synchronization
    useEffect(() => {
        syncTime();
        // Optional: Resync periodically (e.g., every hour)
        const resyncInterval = setInterval(syncTime, 3600 * 1000); 
        return () => clearInterval(resyncInterval);
    }, [syncTime]);

    // Effect for the precise timer
    useEffect(() => {
        // Clear any existing timeout when offset changes or component unmounts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Don't start the timer until sync is complete (or failed)
        if (isSyncing) {
            return;
        }

        const tick = () => {
            const correctedTime = Date.now() + timeOffset;
            setCurrentTime(new Date(correctedTime));

            // Calculate delay until the next second boundary
            const delay = 1000 - (correctedTime % 1000);
            timeoutRef.current = setTimeout(tick, delay);
        };

        // Start the timer precisely at the beginning of the next second
        const initialDelay = 1000 - ( (Date.now() + timeOffset) % 1000);
        timeoutRef.current = setTimeout(tick, initialDelay);


        // Cleanup function to clear the timeout
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [timeOffset, isSyncing]); // Rerun effect if offset changes or sync status changes

    // Function to toggle the format
    const toggleFormat = useCallback(() => {
        setIs24Hour(prev => !prev);
    }, []);

    // Get the time parts based on the current (potentially offset) time
    const timeParts = getTimeParts(currentTime, is24Hour);
    // Keep a formatted string version as well, might be useful
    // const formattedTime = formatFullTimeString(currentTime, is24Hour); // Re-enable if needed

    return {
        currentTime, // The Date object, adjusted by the offset
        // formattedTime, // Keep the fully formatted string if needed elsewhere
        timeParts,     // The parts object for display { hours, minutes, seconds, ampm }
        is24Hour,      // Expose the format state
        toggleFormat,  // Expose the toggle function
        isSyncing,     // Expose syncing status
    };
};