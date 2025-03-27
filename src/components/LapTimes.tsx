
import React from 'react';
import { cn } from '@/lib/utils';

interface LapTimesProps {
  laps: string[];
}

const LapTimes: React.FC<LapTimesProps> = ({ laps }) => {
  if (laps.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-12 glassmorphic rounded-2xl p-4 animate-fade-in">
      <h2 className="text-lg font-mono text-center mb-4 uppercase tracking-wider text-muted-foreground">Lap Times</h2>
      
      <div className="max-h-60 overflow-y-auto scrollbar-thin pr-2">
        <table className="w-full">
          <tbody>
            {laps.map((lap, index) => (
              <tr 
                key={index}
                className={cn(
                  "font-mono transition-opacity",
                  "animate-fade-in"
                )}
              >
                <td className="py-2 text-left text-muted-foreground">
                  #{laps.length - index}
                </td>
                <td className="py-2 text-right">{lap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LapTimes;
