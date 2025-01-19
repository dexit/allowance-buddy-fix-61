import { motion } from "framer-motion";
import { ChildFormData } from "@/lib/types";

interface TimelineProps {
  children: ChildFormData[];
}

export function Timeline({ children }: TimelineProps) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500"
  ];

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold">Fostering Timeline</h3>
      <div className="relative h-[200px] bg-muted rounded-lg overflow-hidden">
        {children.map((child, childIndex) => (
          <div key={child.id} className="relative h-[40px] mb-2">
            <span className="absolute -left-20 text-sm">
              Child {childIndex + 1}
            </span>
            {child.weekIntervals.map((interval, intervalIndex) => (
              <motion.div
                key={`${childIndex}-${intervalIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`absolute h-full ${colors[childIndex % colors.length]} opacity-70 rounded`}
                style={{
                  left: `${(interval.start - 1) / 52 * 100}%`,
                  width: `${(interval.end - interval.start + 1) / 52 * 100}%`,
                }}
              />
            ))}
          </div>
        ))}
        
        {/* Week markers */}
        {[...Array(13)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-border"
            style={{ left: `${(i) / 12 * 100}%` }}
          />
        ))}
      </div>
      
      {/* Week labels */}
      <div className="flex justify-between text-sm text-muted-foreground">
        {[...Array(13)].map((_, i) => (
          <span key={i}>{i * 4}</span>
        ))}
      </div>
    </div>
  );
}