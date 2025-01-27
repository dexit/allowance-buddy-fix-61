import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StepContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const StepContainer = ({ title, description, children }: StepContainerProps) => {
  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};