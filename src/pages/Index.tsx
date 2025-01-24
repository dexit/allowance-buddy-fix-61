import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChildForm } from "@/components/foster/ChildForm";
import { ResultsDisplay } from "@/components/foster/ResultsDisplay";
import { Timeline } from "@/components/foster/Timeline";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { ChildFormData } from "@/lib/types";
import { siteConfig } from "@/config/theme";

export default function Index() {
  const [children, setChildren] = useState<ChildFormData[]>([
    { 
      id: uuidv4(), 
      ageGroup: "0-4", 
      isSpecialCare: false, 
      weekIntervals: [{ start: 1, end: 52 }]
    }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAddChild = () => {
    setChildren([
      ...children,
      { 
        id: uuidv4(), 
        ageGroup: "0-4", 
        isSpecialCare: false, 
        weekIntervals: [{ start: 1, end: 52 }]
      }
    ]);
  };

  const handleRemoveChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const handleUpdateChild = (id: string, data: Partial<ChildFormData>) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, ...data } : child
    ));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateTotalAllowance(children, false);
    setResult(calculatedResult);
    toast({
      title: "Calculation Complete",
      description: "Your foster care allowance has been calculated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl font-bold tracking-tight mb-4"
            style={{ color: siteConfig.colors.text.primary }}
          >
            Foster Care Allowance Calculator
          </h1>
          <p 
            className="text-xl"
            style={{ color: siteConfig.colors.text.secondary }}
          >
            Calculate your potential foster care allowance based on your circumstances
          </p>
        </motion.div>

        <div className="space-y-6">
          {children.map((child, index) => (
            <ChildForm
              key={child.id}
              child={child}
              onUpdate={handleUpdateChild}
              onRemove={handleRemoveChild}
              canRemove={children.length > 1}
            />
          ))}

          <div className="flex justify-between items-center">
            <Button
              onClick={handleAddChild}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Child
            </Button>
            <Button
              onClick={handleCalculate}
              className={`w-full sm:w-auto ${siteConfig.forms.calculator.buttonColor} ${siteConfig.forms.calculator.buttonHoverColor}`}
            >
              Calculate Allowance
            </Button>
          </div>

          {children.length > 0 && (
            <Timeline children={children} />
          )}

          {result && (
            <ResultsDisplay result={result} />
          )}
        </div>
      </div>
    </div>
  );
}