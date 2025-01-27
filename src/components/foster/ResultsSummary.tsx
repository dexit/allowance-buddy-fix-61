import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResultsSummaryProps {
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  totalWeeksInCare: number;
}

export function ResultsSummary({ weeklyTotal, monthlyTotal, yearlyTotal, totalWeeksInCare }: ResultsSummaryProps) {
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
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300">Total Allowance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground">
              Based on {totalWeeksInCare} total weeks of care across all children
            </p>
          </div>
          <div className="space-y-3 divide-y divide-green-200 dark:divide-green-700">
            <p className="flex justify-between text-lg py-2">
              <span>Average Weekly Total:</span>
              <span className="font-bold text-green-700 dark:text-green-300">{formatCurrency(weeklyTotal)}</span>
            </p>
            <p className="flex justify-between text-lg py-2">
              <span>Monthly Estimate:</span>
              <span className="font-bold text-green-700 dark:text-green-300">{formatCurrency(monthlyTotal)}</span>
            </p>
            <p className="flex justify-between text-lg py-2">
              <span>Yearly Estimate:</span>
              <span className="font-bold text-green-700 dark:text-green-300">{formatCurrency(yearlyTotal)}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}