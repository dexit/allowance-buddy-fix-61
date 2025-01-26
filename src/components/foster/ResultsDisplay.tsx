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
                  <p className="flex justify-between font-medium text-base">
                    <span>Base Weekly Rate:</span>
                    <span>{formatCurrency(child.baseAllowance)}</span>
                  </p>
                  
                  {childData.weekIntervals.map((interval, intervalIndex) => (
                    <Card key={intervalIndex} className="p-4 bg-muted/30">
                      <h4 className="font-medium mb-2">Interval {intervalIndex + 1}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span>Weeks:</span>
                          <span>Week {interval.start} - Week {interval.end} ({interval.end - interval.start + 1} weeks)</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Base Rate × Weeks:</span>
                          <span>{formatCurrency(child.baseAllowance * (interval.end - interval.start + 1))}</span>
                        </p>
                        {child.specialCareAmount > 0 && (
                          <p className="flex justify-between">
                            <span>Special Care Amount:</span>
                            <span>{formatCurrency(child.specialCareAmount * (interval.end - interval.start + 1))}</span>
                          </p>
                        )}
                        <p className="flex justify-between font-medium border-t pt-1 mt-1">
                          <span>Interval Total:</span>
                          <span>{formatCurrency((child.baseAllowance + child.specialCareAmount) * (interval.end - interval.start + 1))}</span>
                        </p>
                      </div>
                    </Card>
                  ))}

                  <div className="border-t pt-2 mt-4">
                    <p className="flex justify-between text-base font-semibold">
                      <span>Child Total:</span>
                      <span>{formatCurrency(child.totalAllowance)}</span>
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
            <p className="flex justify-between text-lg">
              <span>Weekly Total:</span>
              <span className="font-bold">{formatCurrency(result.weeklyTotal)}</span>
            </p>
            <p className="flex justify-between text-lg">
              <span>Monthly Estimate:</span>
              <span className="font-bold">{formatCurrency(result.monthlyTotal)}</span>
            </p>
            <p className="flex justify-between text-lg">
              <span>Yearly Estimate:</span>
              <span className="font-bold">{formatCurrency(result.yearlyTotal)}</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}