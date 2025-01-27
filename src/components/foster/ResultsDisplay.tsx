import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Timeline } from "./Timeline";
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

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
      className="space-y-6"
    >
      {result.children.map((child, index) => {
        const childData = childrenData[index];
        if (!childData) return null;

        // Calculate total weeks and allowance for all periods
        const periodsCalculation = childData.weekIntervals.map((interval) => {
          const weeks = interval.end - interval.start + 1;
          const weeklyRate = child.baseAllowance + child.specialCareAmount;
          const periodTotal = weeklyRate * weeks;
          return { weeks, weeklyRate, periodTotal };
        });

        const totalWeeks = periodsCalculation.reduce((sum, period) => sum + period.weeks, 0);
        const childTotalAllowance = periodsCalculation.reduce((sum, period) => sum + period.periodTotal, 0);
        const averageWeeklyRate = childTotalAllowance / totalWeeks;

        return (
          <motion.div
            key={childData.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Child {index + 1} (Age Group {child.ageGroup})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {periodsCalculation.map((period, intervalIndex) => (
                    <Card key={intervalIndex} className="p-4 bg-muted/30">
                      <h4 className="font-medium mb-3 text-base">Period {intervalIndex + 1}</h4>
                      <div className="space-y-2">
                        <div className="bg-muted/20 p-3 rounded-lg">
                          <p className="flex justify-between mb-1">
                            <span>Week {childData.weekIntervals[intervalIndex].start} - Week {childData.weekIntervals[intervalIndex].end}</span>
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Total: {period.weeks} Weeks
                          </p>
                          <p className="flex justify-between text-sm mb-1">
                            <span>Weekly rate (including special care):</span>
                            <span>{formatCurrency(period.weeklyRate)}</span>
                          </p>
                          <p className="flex justify-between font-medium border-t pt-2 mt-2">
                            <span>Period {intervalIndex + 1} Total:</span>
                            <span>{formatCurrency(period.periodTotal)}</span>
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div className="border-t pt-2 mt-4">
                    <p className="flex justify-between text-base">
                      <span>Total Weeks in Care:</span>
                      <span>{totalWeeks}</span>
                    </p>
                    <p className="flex justify-between text-base">
                      <span>Average Weekly Rate:</span>
                      <span>{formatCurrency(averageWeeklyRate)}</span>
                    </p>
                    <p className="flex justify-between text-base font-semibold mt-2">
                      <span>Child Total:</span>
                      <span>{formatCurrency(childTotalAllowance)}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      <Timeline children={childrenData} showLegend={true} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle>Total Allowance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">
                Based on {totalWeeksInCare} total weeks of care across all children
              </p>
            </div>
            <p className="flex justify-between text-lg">
              <span>Average Weekly Total:</span>
              <span className="font-bold">{formatCurrency(result.weeklyTotal)}</span>
            </p>
            <p className="flex justify-between text-lg">
              <span>Monthly Estimate (based on average):</span>
              <span className="font-bold">{formatCurrency(result.monthlyTotal)}</span>
            </p>
            <p className="flex justify-between text-lg">
              <span>Yearly Estimate (based on average):</span>
              <span className="font-bold">{formatCurrency(result.yearlyTotal)}</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}