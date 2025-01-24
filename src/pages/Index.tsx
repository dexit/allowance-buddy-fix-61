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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      description: "Please proceed with adding children details.",
      variant: "default",
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
      description: "Your foster care allowance has been calculated.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
            {siteConfig.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            {siteConfig.description}
          </p>
        </motion.div>

        <div className="space-y-8">
          {step === 'userInfo' ? (
            <Card className="border-2 border-primary/10">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-primary">
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Please provide your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserInfoForm 
                  onSubmit={handleUserInfoSubmit}
                  isLoading={false}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-2 border-primary/10">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-primary">
                    Children Details
                  </CardTitle>
                  <CardDescription>
                    Add information about each child
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
              </Card>

              {children.length > 0 && (
                <Card className="border-2 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">
                      Timeline View
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Timeline children={children} />
                  </CardContent>
                </Card>
              )}

              {result && (
                <Card className="border-2 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">
                      Calculation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsDisplay result={result} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}