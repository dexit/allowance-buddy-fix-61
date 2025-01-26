import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { WeekInterval } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";

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
        <Label className="text-sm font-medium">Weeks in Care</Label>
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
                <Plus className="h-4 w-4 mr-2" />
                Add Period
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new care period (max 52 weeks total)</p>
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
            className="flex flex-col gap-2 p-4 border rounded-lg bg-muted/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Care Period {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInterval(index)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-xs mb-1">Start Week</Label>
                <Input
                  type="number"
                  min={1}
                  max={52}
                  value={interval.start}
                  onChange={(e) => updateInterval(index, "start", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs mb-1">End Week</Label>
                <Input
                  type="number"
                  min={interval.start}
                  max={52}
                  value={interval.end}
                  onChange={(e) => updateInterval(index, "end", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Duration: {interval.end - interval.start + 1} weeks
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Total weeks in care:</span>
        <span className="font-medium">{calculateTotalWeeks(intervals)}</span>
      </div>
    </div>
  );
}