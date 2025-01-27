import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Period {
  weeks: number;
  weeklyRate: number;
  periodTotal: number;
  start: number;
  end: number;
}

interface ChildAllowanceCardProps {
  index: number;
  ageGroup: string;
  periods: Period[];
  totalWeeks: number;
  averageWeeklyRate: number;
  childTotalAllowance: number;
}

export function ChildAllowanceCard({
  index,
  ageGroup,
  periods,
  totalWeeks,
  averageWeeklyRate,
  childTotalAllowance
}: ChildAllowanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-primary">
            Child {index + 1} (Age Group {ageGroup})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {periods.map((period, intervalIndex) => (
              <Card key={intervalIndex} className="bg-white/50 dark:bg-gray-800/50 border-none shadow-sm">
                <div className="p-4">
                  <h4 className="font-medium mb-3 text-base">Period {intervalIndex + 1}</h4>
                  <div className="space-y-2">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <p className="flex justify-between mb-2">
                        <span>Week {period.start} - Week {period.end}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Total: {period.weeks} Weeks
                      </p>
                      <p className="flex justify-between text-sm mb-2">
                        <span>Weekly rate:</span>
                        <span>{formatCurrency(period.weeklyRate)}</span>
                      </p>
                      <p className="flex justify-between font-medium border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span>Period Total:</span>
                        <span>{formatCurrency(period.periodTotal)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <p className="flex justify-between text-base mb-2">
              <span>Total Weeks in Care:</span>
              <span>{totalWeeks}</span>
            </p>
            <p className="flex justify-between text-base mb-2">
              <span>Average Weekly Rate:</span>
              <span>{formatCurrency(averageWeeklyRate)}</span>
            </p>
            <p className="flex justify-between text-lg font-semibold mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Child Total:</span>
              <span className="text-primary">{formatCurrency(childTotalAllowance)}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}