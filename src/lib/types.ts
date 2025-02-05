
export interface WeekInterval {
  start: number;
  end: number;
}

export interface PriceModifier {
  amount: number;
  reason: string;
}

export interface ChildFormData {
  id: string;
  ageGroup: AgeGroup;
  isSpecialCare: boolean;
  weekIntervals: WeekInterval[];
  region: Region;
  additionalModifiers: PriceModifier[];
  deductionModifiers: PriceModifier[];
}

export interface UserInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  address?: string;
  isExperiencedCarer: boolean;
}

export interface ChildAllowance {
  ageGroup: string;
  baseAllowance: number;
  ageRelatedElement: number;
  specialCareAmount: number;
  totalAllowance: number;
  weeklyModifiers: {
    additions: number;
    deductions: number;
  };
}

export interface TotalAllowance {
  children: ChildAllowance[];
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
}

export type AgeGroup = "0-2" | "3-4" | "5-10" | "11-15" | "16-17";
export type Region = "London" | "South East" | "Rest of England";
