import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { generatePDF } from "@/lib/pdf";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChildForm } from "@/components/foster/ChildForm";
import { ResultsDisplay } from "@/components/foster/ResultsDisplay";
import { Timeline } from "@/components/foster/Timeline";
import { v4 as uuidv4 } from "uuid";
import { UserInfoForm, UserInfoFormData } from "@/components/foster/UserInfoForm";
import { ChildFormData, AgeGroup, Region } from "@/lib/types";
import { StepHeader } from "@/components/foster/StepHeader";
import { StepContainer } from "@/components/foster/StepContainer";
import { submitToHubspot } from "@/lib/hubspot";

const DEFAULT_REGION: Region = "Rest of England";

export const FosterCalculator = () => {
  const [step, setStep] = useState<'userInfo' | 'children' | 'results'>('userInfo');
  const [userInfo, setUserInfo] = useState<UserInfoFormData | null>(null);
  const [children, setChildren] = useState<ChildFormData[]>([
    {
      id: uuidv4(),
      ageGroup: "0-2" as AgeGroup,
      isSpecialCare: false,
      weekIntervals: [{ start: 1, end: 52 }],
      region: DEFAULT_REGION
    }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleUserInfoSubmit = (data: UserInfoFormData) => {
    setUserInfo(data);
    setStep('children');
    toast({
      title: "Information Saved",
      description: "Please proceed with adding children details.",
      variant: "default",
    });
  };

  const handleAddChild = () => {
    setChildren([
      ...children,
      {
        id: uuidv4(),
        ageGroup: "0-2" as AgeGroup,
        isSpecialCare: false,
        weekIntervals: [{ start: 1, end: 52 }],
        region: DEFAULT_REGION
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

  const handleCalculate = async () => {
    if (!userInfo) return;
    
    const calculatedResult = calculateTotalAllowance(children, userInfo.isExperiencedCarer);
    setResult(calculatedResult);
    setStep('results');
    
    // Map UserInfoFormData to the format expected by Hubspot
    const hubspotData = {
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      phone: userInfo.phone,
      isExperiencedCarer: userInfo.isExperiencedCarer
    };
    
    const response = await submitToHubspot({
      userInfo: hubspotData,
      children,
      result: calculatedResult
    });
    
    toast({
      title: response.status === 'success' ? "Calculation Complete" : "Warning",
      description: response.message || "Your foster care allowance has been calculated.",
      variant: response.status === 'success' ? "default" : "destructive",
    });
  };

  const handleDownloadPDF = () => {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer && userInfo) {
      generatePDF(result, resultsContainer as HTMLElement, userInfo);
      toast({
        title: "PDF Generated",
        description: "Your allowance summary has been downloaded.",
        variant: "default",
      });
    }
  };

  const handleReset = () => {
    setStep('userInfo');
    setUserInfo(null);
    setChildren([{
      id: uuidv4(),
      ageGroup: "0-2" as AgeGroup,
      isSpecialCare: false,
      weekIntervals: [{ start: 1, end: 52 }],
      region: DEFAULT_REGION
    }]);
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {step === 'userInfo' && (
        <StepContainer
          title="Personal Information"
          description="Please provide your details to get started"
        >
          <UserInfoForm 
            onSubmit={handleUserInfoSubmit}
            isLoading={false}
          />
        </StepContainer>
      )}

      {step === 'children' && (
        <StepContainer
          title="Children Details"
          description="Add information about each child"
        >
          {children.map((child) => (
            <ChildForm
              key={child.id}
              child={child}
              onUpdate={handleUpdateChild}
              onRemove={handleRemoveChild}
              canRemove={children.length > 1}
            />
          ))}

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
            <Button
              onClick={handleAddChild}
              variant="outline"
              className="w-full sm:w-auto border-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Child
            </Button>
            <Button
              onClick={handleCalculate}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Calculate Allowance
            </Button>
          </div>
        </StepContainer>
      )}

      {step === 'results' && result && (
        <StepContainer
          title="Your Allowance Results"
          description="Review your calculated allowances"
        >
          <div className="results-container print:m-0 print:p-0">
            <ResultsDisplay result={result} childrenData={children} />
            <div className="timeline-container">
              <Timeline children={children} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              onClick={() => setStep('children')}
              variant="outline"
              className="w-full sm:w-auto border-primary hover:bg-primary/10"
            >
              Go Back
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Download PDF
            </Button>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Reset Form
            </Button>
          </div>
        </StepContainer>
      )}
    </div>
  );
};