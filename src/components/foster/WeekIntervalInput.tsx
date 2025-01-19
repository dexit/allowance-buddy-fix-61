import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { WeekInterval } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface WeekIntervalInputProps {
  intervals: WeekInterval[];
  onChange: (intervals: WeekInterval[]) => void;
}

export function WeekIntervalInput({ intervals, onChange }: WeekIntervalInputProps) {
  const [error, setError] = useState<string | null>(null);

  const addInterval = () => {
    const newInterval: WeekInterval = { start: 1, end: 1 };
    onChange([...intervals, newInterval]);
  };

  const removeInterval = (index: number) => {
    onChange(intervals.filter((_, i) => i !== index));
  };

  const updateInterval = (index: number, field: keyof WeekInterval, value: number) => {
    const newIntervals = [...intervals];
    newIntervals[index] = { ...newIntervals[index], [field]: value };
    
    // Validate total weeks
    const totalWeeks = calculateTotalWeeks(newIntervals);
    if (totalWeeks > 52) {
      setError("Total weeks cannot exceed 52");
      return;
    }
    setError(null);
    
    onChange(newIntervals);
  };

  const calculateTotalWeeks = (intervals: WeekInterval[]): number => {
    return intervals.reduce((total, interval) => 
      total + (interval.end - interval.start + 1), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Week Intervals</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInterval}
                disabled={calculateTotalWeeks(intervals) >= 52}
              >
                <Plus className="h-4 w-4" />
                Add Interval
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new week interval (max 52 weeks total)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <AnimatePresence>
        {intervals.map((interval, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Input
              type="number"
              min={1}
              max={52}
              value={interval.start}
              onChange={(e) => updateInterval(index, "start", parseInt(e.target.value))}
              className="w-20"
            />
            <span>to</span>
            <Input
              type="number"
              min={interval.start}
              max={52}
              value={interval.end}
              onChange={(e) => updateInterval(index, "end", parseInt(e.target.value))}
              className="w-20"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeInterval(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <p className="text-sm text-muted-foreground">
        Total weeks: {calculateTotalWeeks(intervals)}
      </p>
    </div>
  );
}