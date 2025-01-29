import { ChildAllowance, TotalAllowance, AgeGroup, Region } from "@/lib/types";

interface RegionalRates {
  London: number;
  "South East": number;
  "Rest of England": number;
}

interface AllowanceRates {
  [key: string]: RegionalRates;
}

export const AGE_GROUPS = ["0-2", "3-4", "5-10", "11-15", "16-17"] as const;
export const REGIONS = ["London", "South East", "Rest of England"] as const;

const ALLOWANCE_RATES: AllowanceRates = {
  "0-2": {
    "London": 191,
    "South East": 183,
    "Rest of England": 165
  },
  "3-4": {
    "London": 195,
    "South East": 189,
    "Rest of England": 170
  },
  "5-10": {
    "London": 217,
    "South East": 208,
    "Rest of England": 187
  },
  "11-15": {
    "London": 248,
    "South East": 238,
    "Rest of England": 213
  },
  "16-17": {
    "London": 289,
    "South East": 278,
    "Rest of England": 249
  }
};

export const DEFAULT_REGION = "Rest of England" as Region;
export const BASE_RATE_MODIFIER = 0;

export const calculateAllowanceForChild = (
  ageGroup: AgeGroup,
  region: Region,
  isSpecialCare: boolean,
  weekIntervals: Array<{ start: number; end: number }>
): ChildAllowance => {
  const baseAllowance = ALLOWANCE_RATES[ageGroup][region] * (1 + BASE_RATE_MODIFIER);
  const ageRelatedElement = 0;
  
  // Calculate total weeks and total allowance based on intervals
  const totalWeeks = weekIntervals.reduce((sum, interval) => 
    sum + (interval.end - interval.start + 1), 0);
  
  const baseTotal = baseAllowance;
  const specialCareAmount = isSpecialCare ? baseTotal * 0.5 : 0;
  const weeklyAllowance = baseTotal + specialCareAmount;
  
  // Calculate the proportional allowance based on weeks in care
  const totalAllowance = (weeklyAllowance * totalWeeks);

  return {
    ageGroup,
    baseAllowance,
    ageRelatedElement,
    specialCareAmount,
    totalAllowance
  };
};

export const calculateTotalAllowance = (
  children: Array<{ 
    ageGroup: AgeGroup; 
    isSpecialCare: boolean; 
    weekIntervals: Array<{ start: number; end: number }>;
    region: Region;
  }>,
  isExperiencedCarer: boolean
): TotalAllowance => {
  const childrenAllowances = children.map(child => {
    return calculateAllowanceForChild(
      child.ageGroup, 
      child.region, 
      child.isSpecialCare,
      child.weekIntervals
    );
  });

  const weeklyTotal = childrenAllowances.reduce(
    (sum, child) => {
      // Calculate weekly average based on total allowance
      const totalWeeks = child.totalAllowance / (child.baseAllowance + child.specialCareAmount);
      return sum + (child.totalAllowance / totalWeeks);
    },
    0
  );

  return {
    children: childrenAllowances,
    weeklyTotal,
    monthlyTotal: weeklyTotal * 4.33,
    yearlyTotal: weeklyTotal * 52
  };
};
