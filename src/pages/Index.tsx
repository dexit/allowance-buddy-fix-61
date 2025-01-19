import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserInfoForm, type UserInfoFormData } from "@/components/foster/UserInfoForm";
import { ChildForm } from "@/components/foster/ChildForm";
import { ResultsDisplay } from "@/components/foster/ResultsDisplay";
import { Timeline } from "@/components/foster/Timeline";
import { AnimatePresence, motion } from "framer-motion";
import { ChildFormData } from "@/lib/types";
import jsPDF from "jspdf";

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
      const allowance = calculateTotalAllowance(children, userInfo.isExperiencedCarer);
      setResult(allowance);
      setStep('results');
      
      // Simulate API submission
      await fetch('https://api.example.com/foster-allowance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo, children, allowance })
      });
      
      toast({
        title: "Calculation Complete",
        description: "Your foster allowance has been calculated and saved.",
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

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    
    // Add header
    pdf.setFontSize(20);
    pdf.text("Foster Care Allowance Report", 20, 20);
    
    // Add user info
    pdf.setFontSize(12);
    pdf.text(`Name: ${userInfo.name}`, 20, 40);
    pdf.text(`Email: ${userInfo.email}`, 20, 50);
    pdf.text(`Experience: ${userInfo.isExperiencedCarer ? 'Experienced' : 'New'} Carer`, 20, 60);
    
    // Add results
    pdf.text("Weekly Total: £" + result.weeklyTotal.toFixed(2), 20, 80);
    pdf.text("Monthly Total: £" + result.monthlyTotal.toFixed(2), 20, 90);
    pdf.text("Yearly Total: £" + result.yearlyTotal.toFixed(2), 20, 100);
    
    pdf.save("foster-care-allowance.pdf");
    
    toast({
      title: "PDF Downloaded",
      description: "Your report has been downloaded successfully.",
    });
  };

  const handleReset = () => {
    setStep('info');
    setUserInfo({
      name: "",
      email: "",
      isExperiencedCarer: false
    });
    setChildren([{ 
      id: "1", 
      ageGroup: "0-4", 
      isSpecialCare: false, 
      weekIntervals: [{ start: 1, end: 52 }]
    }]);
    setResult(null);
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

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('info')}
                    variant="outline"
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleCalculate}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Calculate
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'results' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <ResultsDisplay result={result} />
              <Timeline children={children} />
              
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => setStep('children')}
                  variant="outline"
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="flex-1"
                >
                  Download PDF
                </Button>
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}