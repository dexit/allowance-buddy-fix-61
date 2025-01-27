import { FosterCalculator } from "@/components/foster/FosterCalculator";
import { StepHeader } from "@/components/foster/StepHeader";

export default function Index() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-4xl mx-auto">
        <StepHeader />
        <FosterCalculator />
      </div>
    </div>
  );
}