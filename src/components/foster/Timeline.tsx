import { motion } from "framer-motion";
import { ChildFormData } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface TimelineProps {
  children: ChildFormData[];
  showLegend?: boolean;
}

export function Timeline({ children, showLegend = false }: TimelineProps) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500"
  ];

  return (
    <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <h3 className="text-xl font-semibold mb-6">Fostering Timeline</h3>
      <div className="relative h-[200px] bg-gray-100 dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-inner">
        {children.map((child, childIndex) => (
          <div key={child.id} className="relative h-[40px] mb-2">
            <span className="absolute -left-20 text-sm font-medium">
              Child {childIndex + 1}
            </span>
            {child.weekIntervals.map((interval, intervalIndex) => (
              <motion.div
                key={`${childIndex}-${intervalIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={`absolute h-full ${colors[childIndex % colors.length]} opacity-80 rounded-md shadow-sm`}
                style={{
                  left: `${(interval.start - 1) / 52 * 100}%`,
                  width: `${(interval.end - interval.start + 1) / 52 * 100}%`,
                }}
              >
                {showLegend && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                    {interval.start}-{interval.end}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ))}
        
        {/* Week markers */}
        {[...Array(13)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-gray-200 dark:bg-gray-700"
            style={{ left: `${(i) / 12 * 100}%` }}
          />
        ))}
      </div>
      
      {/* Week labels */}
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        {[...Array(13)].map((_, i) => (
          <span key={i}>{i * 4}</span>
        ))}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-6">
          {children.map((child, index) => (
            <div key={child.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
              <span className="text-sm font-medium">Child {index + 1} ({child.ageGroup})</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}