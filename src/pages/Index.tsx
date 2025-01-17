import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalAllowance, AGE_GROUPS, type AgeGroup } from "@/lib/calculator";
import { Plus, Minus, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface Child {
  id: string;
  ageGroup: AgeGroup;
  isSpecialCare: boolean;
  weeks: number;
}

interface UserInfo {
  name: string;
  email: string;
  isExperiencedCarer: boolean;
}

const Index = () => {
  const [step, setStep] = useState<'info' | 'children' | 'results'>('info');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    isExperiencedCarer: false
  });
  const [children, setChildren] = useState<Child[]>([
    { id: "1", ageGroup: "0-4", isSpecialCare: false, weeks: 52 }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

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
        weeks: 52 - totalWeeks 
      }
    ]);
  };

  const handleRemoveChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const handleAgeGroupChange = (id: string, value: AgeGroup) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, ageGroup: value } : child
    ));
  };

  const handleCareTypeChange = (id: string, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, isSpecialCare: value === 'special' } : child
    ));
  };

  const handleWeeksChange = (id: string, weeks: number) => {
    const otherChildrenWeeks = children
      .filter(child => child.id !== id)
      .reduce((sum, child) => sum + child.weeks, 0);
    
    if (otherChildrenWeeks + weeks > 52) {
      toast({
        title: "Invalid Weeks",
        description: "Total weeks across all children cannot exceed 52",
        variant: "destructive",
      });
      return;
    }

    setChildren(children.map(child => 
      child.id === id ? { ...child, weeks } : child
    ));
  };

  const handleCalculate = () => {
    const allowance = calculateTotalAllowance(children, userInfo.isExperiencedCarer);
    setResult(allowance);
    setStep('results');
    
    toast({
      title: "Calculation Complete",
      description: "Your foster allowance has been calculated.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <input
                  id="name"
                  className="w-full p-2 border rounded"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Foster Care Experience</Label>
                <Select
                  value={userInfo.isExperiencedCarer ? "experienced" : "new"}
                  onValueChange={(value) => setUserInfo({
                    ...userInfo,
                    isExperiencedCarer: value === "experienced"
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Foster Carer</SelectItem>
                    <SelectItem value="experienced">Experienced Foster Carer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => {
                  if (!userInfo.name || !userInfo.email) {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in all fields",
                      variant: "destructive",
                    });
                    return;
                  }
                  setStep('children');
                }}
                className="w-full mt-4"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'children') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Children Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {children.map((child, index) => (
                  <div key={child.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Child {index + 1}</h3>
                      {children.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveChild(child.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`ageGroup-${child.id}`}>Age Group</Label>
                        <Select
                          value={child.ageGroup}
                          onValueChange={(value) => handleAgeGroupChange(child.id, value as AgeGroup)}
                        >
                          <SelectTrigger id={`ageGroup-${child.id}`}>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                          <SelectContent>
                            {AGE_GROUPS.map((ageGroup) => (
                              <SelectItem key={ageGroup} value={ageGroup}>
                                {ageGroup}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`careType-${child.id}`}>Care Type</Label>
                        <Select
                          value={child.isSpecialCare ? "special" : "standard"}
                          onValueChange={(value) => handleCareTypeChange(child.id, value)}
                        >
                          <SelectTrigger id={`careType-${child.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Care</SelectItem>
                            <SelectItem value="special">Special Care</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Weeks ({child.weeks})</Label>
                      <Slider
                        value={[child.weeks]}
                        min={1}
                        max={52}
                        step={1}
                        onValueChange={([value]) => handleWeeksChange(child.id, value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

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
              >
                Calculate Allowance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'results' && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.children.map((child: any, index: number) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg space-y-3">
                  <h3 className="font-semibold text-lg text-blue-900">
                    Child {index + 1} (Age Group {child.ageGroup}) - Weekly Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Base Rate:</span>
                      <span className="font-medium">{formatCurrency(child.baseAllowance)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Age-Related Element:</span>
                      <span className="font-medium">{formatCurrency(child.ageRelatedElement)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Special Care Amount:</span>
                      <span className="font-medium">{formatCurrency(child.specialCareAmount)}</span>
                    </p>
                    <div className="border-t pt-2">
                      <p className="flex justify-between text-base font-semibold">
                        <span>Child's Weekly Total:</span>
                        <span>{formatCurrency(child.totalAllowance)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-6 bg-green-50 rounded-lg space-y-4">
                <h3 className="font-bold text-xl text-green-900">
                  Total Allowance Summary
                </h3>
                <div className="space-y-3">
                  <p className="flex justify-between text-lg">
                    <span>Weekly Total:</span>
                    <span className="font-bold">{formatCurrency(result.weeklyTotal)}</span>
                  </p>
                  <p className="flex justify-between text-lg">
                    <span>Monthly Estimate:</span>
                    <span className="font-bold">{formatCurrency(result.monthlyTotal)}</span>
                  </p>
                  <p className="flex justify-between text-lg">
                    <span>Yearly Estimate:</span>
                    <span className="font-bold">{formatCurrency(result.yearlyTotal)}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
