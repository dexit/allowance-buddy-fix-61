import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { Json } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Step = 'info' | 'children' | 'results';

export default function Index() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <IndexContent />
    </SessionContextProvider>
  );
}

function IndexContent() {
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCalculator, setShowCalculator] = useState(false);
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(currentSession);
      } catch (error) {
        console.error('Session error:', error);
        setAuthError("Failed to initialize authentication. Please try again.");
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setAuthError(""); // Clear any previous errors on auth state change
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Here you would typically send this to your backend
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: { email, phone }
      });

      if (error) throw error;

      toast({
        title: "Subscription Successful",
        description: "Thank you for subscribing! Check your email for more information.",
      });
      
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your calculations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const allowance = calculateTotalAllowance(children, userInfo.isExperiencedCarer);
      setResult(allowance);
      setStep('results');
      
      const submissionData = {
        user_info: userInfo as unknown as Json,
        children_data: children.map(child => ({
          id: child.id,
          ageGroup: child.ageGroup,
          isSpecialCare: child.isSpecialCare,
          weekIntervals: child.weekIntervals
        })) as unknown as Json,
        calculations: allowance as unknown as Json,
        status: 'submitted'
      };

      const { error: submissionError } = await supabase
        .from('foster_submissions')
        .insert([submissionData]);

      if (submissionError) {
        console.error('Submission error:', submissionError);
        throw new Error(submissionError.message);
      }
      
      toast({
        title: "Calculation Complete",
        description: "Your foster allowance has been calculated and saved.",
      });
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save calculation. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
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

  const SubscriptionForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50"
    >
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img
            src="https://f5fostercare.co.uk/wp-content/smush-webp/2024/08/f5-web-logo-done.png.webp"
            alt="F5 Foster Care"
            className="mx-auto h-16 mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to F5 Foster Care</h1>
          <p className="text-gray-600">Subscribe to learn more about fostering opportunities</p>
        </div>

        <Card className="p-6 shadow-lg bg-white/80 backdrop-blur">
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setShowCalculator(true)}
              className="text-[#9b87f5] hover:text-[#7E69AB]"
            >
              Access Foster Care Calculator
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );

  if (!showCalculator) {
    return <SubscriptionForm />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-8">
            Foster Care Calculator
          </h2>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <div className="bg-white p-8 rounded-lg shadow">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => setShowCalculator(false)}
            className="text-[#9b87f5]"
          >
            Back to Subscribe
          </Button>
          {session && (
            <Button
              variant="outline"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          )}
        </div>

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