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
import { siteConfig } from "@/config/theme";
import { UserInfoForm, UserInfoFormData } from "@/components/foster/UserInfoForm";
import { ChildFormData, AgeGroup } from "@/lib/types";

export default function Index() {
  const [step, setStep] = useState<'userInfo' | 'children'>('userInfo');
  const [userInfo, setUserInfo] = useState<UserInfoFormData | null>(null);
  const [children, setChildren] = useState<ChildFormData[]>([
    {
      id: uuidv4(),
      ageGroup: "0-4" as AgeGroup,
      isSpecialCare: false,
      weekIntervals: [{ start: 1, end: 52 }]
    }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleUserInfoSubmit = (data: UserInfoFormData) => {
    setUserInfo(data);
    setStep('children');
    toast({
      title: "Information Saved",
      description: "Please proceed with adding children details."
    });
  };

  const handleAddChild = () => {
    setChildren([
      ...children,
      {
        id: uuidv4(),
        ageGroup: "0-4" as AgeGroup,
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
      description: "Your foster care allowance has been calculated."
    });
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        background: `linear-gradient(to bottom, ${siteConfig.colors.background.primary}, ${siteConfig.colors.background.secondary})`
      }}
    >
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
            {siteConfig.name}
          </h1>
          <p 
            className="text-xl"
            style={{ color: siteConfig.colors.text.secondary }}
          >
            {siteConfig.description}
          </p>
        </motion.div>

        <div className="space-y-6">
          {step === 'userInfo' ? (
            <UserInfoForm onSubmit={handleUserInfoSubmit} />
          ) : (
            <>
              {children.map((child) => (
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
                  style={{
                    borderColor: siteConfig.colors.primary,
                    color: siteConfig.colors.text.primary
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Child
                </Button>
                <Button
                  onClick={handleCalculate}
                  className="w-full sm:w-auto"
                  style={{
                    backgroundColor: siteConfig.colors.primary,
                    color: siteConfig.colors.background.primary
                  }}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}