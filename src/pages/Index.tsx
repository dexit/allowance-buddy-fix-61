import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calculateAllowance } from "@/lib/calculator";

interface AllowanceResult {
  baseAllowance: number;
  ageRelatedElement: number;
  totalAllowance: number;
}

const Index = () => {
  const [age, setAge] = useState<string>("");
  const [result, setResult] = useState<AllowanceResult | null>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    const ageNum = parseInt(age);
    
    if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 17) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 0 and 17",
        variant: "destructive",
      });
      return;
    }

    const allowance = calculateAllowance(ageNum);
    setResult(allowance);
    
    toast({
      title: "Calculation Complete",
      description: "Your foster allowance has been calculated.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Foster Allowance Calculator
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Calculate Allowance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Child's Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age (0-17)"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                max="17"
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleCalculate}
              className="w-full"
            >
              Calculate Allowance
            </Button>

            {result && (
              <div className="mt-6 space-y-3 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900">
                  Weekly Allowance Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Base Rate:</span>
                    <span className="font-medium">{formatCurrency(result.baseAllowance)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Age-Related Element:</span>
                    <span className="font-medium">{formatCurrency(result.ageRelatedElement)}</span>
                  </p>
                  <div className="border-t pt-2 mt-2">
                    <p className="flex justify-between text-base font-semibold">
                      <span>Total Weekly Allowance:</span>
                      <span>{formatCurrency(result.totalAllowance)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;