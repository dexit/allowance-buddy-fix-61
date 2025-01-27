import { motion } from "framer-motion";
import { Timeline } from "./Timeline";
import { ResultsSummary } from "./ResultsSummary";
import { ChildAllowanceCard } from "./ChildAllowanceCard";
import { ChildFormData } from "@/lib/types";

interface ResultsDisplayProps {
  result: {
    children: Array<{
      ageGroup: string;
      baseAllowance: number;
      ageRelatedElement: number;
      specialCareAmount: number;
      totalAllowance: number;
    }>;
    weeklyTotal: number;
    monthlyTotal: number;
    yearlyTotal: number;
  };
  childrenData: ChildFormData[];
}

export function ResultsDisplay({ result, childrenData }: ResultsDisplayProps) {
  // Calculate total weeks across all children
  const totalWeeksInCare = childrenData.reduce((sum, child) => {
    return sum + child.weekIntervals.reduce((intervalSum, interval) => 
      intervalSum + (interval.end - interval.start + 1), 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 print:space-y-6"
    >
      <div className="grid gap-6 md:gap-8">
        {result.children.map((child, index) => {
          const childData = childrenData[index];
          if (!childData) return null;

          // Calculate periods for each child
          const periods = childData.weekIntervals.map((interval) => {
            const weeks = interval.end - interval.start + 1;
            const weeklyRate = child.baseAllowance + child.specialCareAmount;
            const periodTotal = weeklyRate * weeks;
            return { 
              weeks, 
              weeklyRate, 
              periodTotal,
              start: interval.start,
              end: interval.end
            };
          });

          const totalWeeks = periods.reduce((sum, period) => sum + period.weeks, 0);
          const childTotalAllowance = periods.reduce((sum, period) => sum + period.periodTotal, 0);
          const averageWeeklyRate = childTotalAllowance / totalWeeks;

          return (
            <ChildAllowanceCard
              key={childData.id}
              index={index}
              ageGroup={child.ageGroup}
              periods={periods}
              totalWeeks={totalWeeks}
              averageWeeklyRate={averageWeeklyRate}
              childTotalAllowance={childTotalAllowance}
            />
          );
        })}
      </div>

      <div className="my-8 print:my-6">
        <Timeline children={childrenData} showLegend={true} />
      </div>

      <ResultsSummary
        weeklyTotal={result.weeklyTotal}
        monthlyTotal={result.monthlyTotal}
        yearlyTotal={result.yearlyTotal}
        totalWeeksInCare={totalWeeksInCare}
      />
    </motion.div>
  );
}