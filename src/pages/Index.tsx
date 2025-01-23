import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance } from "@/lib/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { UserInfoForm } from "@/components/foster/UserInfoForm";
import { siteConfig } from "@/config/theme";
import { motion } from "framer-motion";

export default function Index() {
  const [step, setStep] = useState<'selection' | 'quick' | 'full'>('selection');
  const { toast } = useToast();

  const handleQuickCheck = () => {
    setStep('quick');
    toast({
      title: "Quick Check Started",
      description: "Let's check your initial eligibility.",
    });
  };

  const handleFullAssessment = () => {
    setStep('full');
    toast({
      title: "Full Assessment Started",
      description: "Let's begin your comprehensive assessment.",
    });
  };

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <img 
            src="/lovable-uploads/e1d12ead-ac66-47a2-b4b3-234cfab97a1f.png"
            alt={siteConfig.name}
            className="h-24 mx-auto mb-8"
          />
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Welcome to {siteConfig.name}
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            {siteConfig.description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <h2 className={`text-2xl font-semibold mb-2 ${siteConfig.forms.quickCheck.textColor}`}>
                  {siteConfig.forms.quickCheck.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {siteConfig.forms.quickCheck.duration}
                </p>
                <p className="text-gray-600 mb-8 flex-grow">
                  {siteConfig.forms.quickCheck.description}
                </p>
                <button
                  onClick={handleQuickCheck}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                    ${siteConfig.forms.quickCheck.buttonColor} 
                    ${siteConfig.forms.quickCheck.buttonHoverColor}`}
                >
                  {siteConfig.forms.quickCheck.buttonText}
                </button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 flex flex-col h-full">
                <h2 className={`text-2xl font-semibold mb-2 ${siteConfig.forms.fullAssessment.textColor}`}>
                  {siteConfig.forms.fullAssessment.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {siteConfig.forms.fullAssessment.duration}
                </p>
                <p className="text-gray-600 mb-8 flex-grow">
                  {siteConfig.forms.fullAssessment.description}
                </p>
                <button
                  onClick={handleFullAssessment}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                    ${siteConfig.forms.fullAssessment.buttonColor} 
                    ${siteConfig.forms.fullAssessment.buttonHoverColor}`}
                >
                  {siteConfig.forms.fullAssessment.buttonText}
                </button>
              </CardContent>
            </Card>
          </div>

          <p className="text-gray-600">
            Need help? Contact us at{" "}
            <a 
              href={`tel:${siteConfig.contact.phone}`}
              className="text-primary hover:underline font-medium"
            >
              {siteConfig.contact.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Render the appropriate form based on the selected step
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setStep('selection')}
          className="mb-8 text-gray-600 hover:text-gray-900 flex items-center"
        >
          ← Back to selection
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {step === 'quick' 
            ? siteConfig.forms.quickCheck.title 
            : siteConfig.forms.fullAssessment.title}
        </h2>

        <UserInfoForm
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            toast({
              title: "Information Submitted",
              description: "Thank you for your submission.",
            });
          }}
        />
      </div>
    </motion.div>
  );
}