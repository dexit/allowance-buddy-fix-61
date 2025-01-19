import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserInfoForm, type UserInfoFormData } from "@/components/foster/UserInfoForm";
import { ChildForm } from "@/components/foster/ChildForm";
import { ResultsDisplay } from "@/components/foster/ResultsDisplay";
import { AnimatePresence, motion } from "framer-motion";
import { Timeline } from "@/components/foster/Timeline";
import { ChildFormData } from "@/lib/types";

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
    { 
      id: "1", 
      ageGroup: "0-4", 
      isSpecialCare: false, 
      weekIntervals: [{ start: 1, end: 52 }]
    }
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
    setChildren([
      ...children,
      { 
        id: crypto.randomUUID(), 
        ageGroup: "0-4", 
        isSpecialCare: false, 
        weekIntervals: [{ start: 1, end: 52 }]
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
                    canRemove={children.length > 1}
                  />
                ))}
              </AnimatePresence>

              <Timeline children={children} />

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
