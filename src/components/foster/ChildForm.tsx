import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { AGE_GROUPS, type AgeGroup } from "@/lib/calculator";
import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChildFormData {
  id: string;
  ageGroup: AgeGroup;
  isSpecialCare: boolean;
  weeks: number;
}

interface ChildFormProps {
  child: ChildFormData;
  onUpdate: (id: string, data: Partial<ChildFormData>) => void;
  onRemove: (id: string) => void;
  remainingWeeks: number;
  canRemove: boolean;
}

export function ChildForm({ child, onUpdate, onRemove, remainingWeeks, canRemove }: ChildFormProps) {
  const maxWeeks = remainingWeeks + child.weeks;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 p-4 border rounded-lg relative"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Child Details</h3>
        {canRemove && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(child.id)}
            className="absolute top-2 right-2"
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel>Age Group</FormLabel>
          <Select
            value={child.ageGroup}
            onValueChange={(value) => onUpdate(child.id, { ageGroup: value as AgeGroup })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGE_GROUPS.map((ageGroup) => (
                <SelectItem key={ageGroup} value={ageGroup}>
                  {ageGroup}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <FormLabel>Care Type</FormLabel>
          <Select
            value={child.isSpecialCare ? "special" : "standard"}
            onValueChange={(value) => 
              onUpdate(child.id, { isSpecialCare: value === "special" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Care</SelectItem>
              <SelectItem value="special">Special Care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <FormLabel>Weeks ({child.weeks})</FormLabel>
          <Slider
            value={[child.weeks]}
            min={1}
            max={maxWeeks}
            step={1}
            onValueChange={([value]) => onUpdate(child.id, { weeks: value })}
          />
          <p className="text-sm text-muted-foreground">
            Remaining weeks available: {remainingWeeks}
          </p>
        </div>
      </div>
    </motion.div>
  );
}