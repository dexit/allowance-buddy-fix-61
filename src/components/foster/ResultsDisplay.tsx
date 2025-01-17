import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
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
      {result.children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Child {index + 1} (Age Group {child.ageGroup})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span>Base Rate:</span>
                  <span className="font-medium">{formatCurrency(child.baseAllowance)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Age-Related Element:</span>
                  <span className="font-medium">{formatCurrency(child.ageRelatedElement)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Special Care Amount:</span>
                  <span className="font-medium">{formatCurrency(child.specialCareAmount)}</span>
                </p>
                <div className="border-t pt-2">
                  <p className="flex justify-between text-base font-semibold">
                    <span>Weekly Total:</span>
                    <span>{formatCurrency(child.totalAllowance)}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

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