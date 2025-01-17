import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { Plus, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Child {
  id: string;
  age: string;
  fosterType: "new" | "experienced";
  weeks: number;
}

const Index = () => {
  const [children, setChildren] = useState<Child[]>([
    { id: "1", age: "", fosterType: "new", weeks: 52 }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAddChild = () => {
    const totalWeeks = children.reduce((sum, child) => sum + child.weeks, 0);
    if (totalWeeks >= 52) {
      toast({
        title: "Maximum Weeks Reached",
        description: "Total weeks across all children cannot exceed 52",
        variant: "destructive",
      });
      return;
    }
    setChildren([
      ...children,
      { id: crypto.randomUUID(), age: "", fosterType: "new", weeks: 52 - totalWeeks }
    ]);
  };

  const handleRemoveChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const handleAgeChange = (id: string, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, age: value } : child
    ));
  };

  const handleFosterTypeChange = (id: string, value: "new" | "experienced") => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, fosterType: value } : child
    ));
  };

  const handleWeeksChange = (id: string, weeks: number) => {
    const otherChildrenWeeks = children
      .filter(child => child.id !== id)
      .reduce((sum, child) => sum + child.weeks, 0);
    
    if (otherChildrenWeeks + weeks > 52) {
      toast({
        title: "Invalid Weeks",
        description: "Total weeks across all children cannot exceed 52",
        variant: "destructive",
      });
      return;
    }

    setChildren(children.map(child => 
      child.id === id ? { ...child, weeks } : child
    ));
  };

  const handleCalculate = () => {
    const ages = children.map(child => parseInt(child.age));
    
    if (ages.some(age => isNaN(age) || age < 0 || age > 17)) {
      toast({
        title: "Invalid Age",
        description: "Please enter valid ages between 0 and 17 for all children",
        variant: "destructive",
      });
      return;
    }

    const allowance = calculateTotalAllowance(ages);
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

  const generateAgeOptions = () => {
    const options = [];
    for (let i = 0; i <= 17; i++) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          {i} years old
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Foster Allowance Calculator
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Calculate Allowance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={child.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Child {index + 1}</h3>
                    {children.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveChild(child.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`age-${child.id}`}>Age</Label>
                      <Select
                        value={child.age}
                        onValueChange={(value) => handleAgeChange(child.id, value)}
                      >
                        <SelectTrigger id={`age-${child.id}`}>
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAgeOptions()}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`type-${child.id}`}>Foster Type</Label>
                      <Select
                        value={child.fosterType}
                        onValueChange={(value: "new" | "experienced") => 
                          handleFosterTypeChange(child.id, value)
                        }
                      >
                        <SelectTrigger id={`type-${child.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Foster Carer</SelectItem>
                          <SelectItem value="experienced">Experienced Foster Carer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Weeks ({child.weeks})</Label>
                    <Slider
                      value={[child.weeks]}
                      min={1}
                      max={52}
                      step={1}
                      onValueChange={([value]) => handleWeeksChange(child.id, value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button 
              type="button"
              variant="outline"
              onClick={handleAddChild}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Child
            </Button>

            <Button 
              onClick={handleCalculate}
              className="w-full"
            >
              Calculate Allowance
            </Button>

            {result && (
              <div className="mt-6 space-y-6">
                {result.children.map((child: any, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg text-blue-900">
                      Child {index + 1} (Age {child.age}) - Weekly Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span>Base Rate:</span>
                        <span className="font-medium">{formatCurrency(child.baseAllowance)}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Age-Related Element:</span>
                        <span className="font-medium">{formatCurrency(child.ageRelatedElement)}</span>
                      </p>
                      <div className="border-t pt-2">
                        <p className="flex justify-between text-base font-semibold">
                          <span>Child's Weekly Total:</span>
                          <span>{formatCurrency(child.totalAllowance)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-6 bg-green-50 rounded-lg space-y-4">
                  <h3 className="font-bold text-xl text-green-900">
                    Total Allowance Summary
                  </h3>
                  <div className="space-y-3">
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