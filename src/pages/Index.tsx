import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserInfoForm, type UserInfoFormData } from "@/components/foster/UserInfoForm";
import { ChildForm, type ChildFormData } from "@/components/foster/ChildForm";
import { ResultsDisplay } from "@/components/foster/ResultsDisplay";
import { AnimatePresence, motion } from "framer-motion";

type Step = 'info' | 'children' | 'results';

export default function Index() {
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoFormData>({
    name: "",
    email: "",
    isExperiencedCarer: false
  });
  const [children, setChildren] = useState<ChildFormData[]>([
    { id: "1", ageGroup: "0-4", isSpecialCare: false, weeks: 52 }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleUserInfoSubmit = async (data: UserInfoFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserInfo(data);
      setStep('children');
      toast({
        title: "Information Saved",
        description: "You can now add children details.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      { 
        id: crypto.randomUUID(), 
        ageGroup: "0-4", 
        isSpecialCare: false, 
        weeks: Math.min(52 - totalWeeks, 52)
      }
    ]);
  };

  const handleUpdateChild = (id: string, data: Partial<ChildFormData>) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, ...data } : child
    ));
  };

  const handleRemoveChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const calculateRemainingWeeks = (currentChildId: string) => {
    const totalWeeksExcludingCurrent = children
      .filter(child => child.id !== currentChildId)
      .reduce((sum, child) => sum + child.weeks, 0);
    return 52 - totalWeeksExcludingCurrent;
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const allowance = calculateTotalAllowance(children, userInfo.isExperiencedCarer);
      setResult(allowance);
      setStep('results');
      toast({
        title: "Calculation Complete",
        description: "Your foster allowance has been calculated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate allowance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'info' && (
            <UserInfoForm
              key="user-info"
              onSubmit={handleUserInfoSubmit}
              isLoading={isLoading}
            />
          )}

          {step === 'children' && (
            <motion.div
              key="children"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <AnimatePresence>
                {children.map(child => (
                  <ChildForm
                    key={child.id}
                    child={child}
                    onUpdate={handleUpdateChild}
                    onRemove={handleRemoveChild}
                    remainingWeeks={calculateRemainingWeeks(child.id)}
                    canRemove={children.length > 1}
                  />
                ))}
              </AnimatePresence>

              <div className="space-y-4">
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
                  disabled={isLoading}
                >
                  {isLoading ? "Calculating..." : "Calculate Allowance"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'results' && result && (
            <ResultsDisplay key="results" result={result} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}