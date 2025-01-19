interface AllowanceRates {
  baseRate: number;
  ageRates: {
    [key: string]: number;
  };
  experiencedMultiplier: number;
  specialCareMultiplier: number;
}

interface ChildAllowance {
  ageGroup: string;
  baseAllowance: number;
  ageRelatedElement: number;
  specialCareAmount: number;
  totalAllowance: number;
}

interface TotalAllowance {
  children: ChildAllowance[];
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
}

const ALLOWANCE_RATES: AllowanceRates = {
  baseRate: 137.18,
  ageRates: {
    "0-4": 67.08,
    "5-10": 76.66,
    "11-15": 86.23,
    "16-17": 100.38
  },
  experiencedMultiplier: 1.2,
  specialCareMultiplier: 1.5
};

export const AGE_GROUPS = ["0-4", "5-10", "11-15", "16-17"] as const;
export type AgeGroup = typeof AGE_GROUPS[number];

export const calculateAllowanceForChild = (
  ageGroup: AgeGroup,
  isSpecialCare: boolean
): ChildAllowance => {
  const baseAllowance = ALLOWANCE_RATES.baseRate;
  const ageRelatedElement = ALLOWANCE_RATES.ageRates[ageGroup];
  const baseTotal = baseAllowance + ageRelatedElement;
  const specialCareAmount = isSpecialCare ? baseTotal * (ALLOWANCE_RATES.specialCareMultiplier - 1) : 0;
  const totalAllowance = baseTotal + specialCareAmount;

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
    weekIntervals: Array<{ start: number; end: number }> 
  }>,
  isExperiencedCarer: boolean
): TotalAllowance => {
  const childrenAllowances = children.map(child => {
    const baseAllowance = calculateAllowanceForChild(child.ageGroup, child.isSpecialCare);
    const totalWeeks = child.weekIntervals.reduce(
      (sum, interval) => sum + (interval.end - interval.start + 1),
      0
    );
    const weeklyAmount = baseAllowance.totalAllowance * (totalWeeks / 52);
    return {
      ...baseAllowance,
      totalAllowance: weeklyAmount
    };
  });

  const weeklyTotal = childrenAllowances.reduce(
    (sum, child) => sum + child.totalAllowance,
    0
  ) * (isExperiencedCarer ? ALLOWANCE_RATES.experiencedMultiplier : 1);

  return {
    children: childrenAllowances,
    weeklyTotal,
    monthlyTotal: weeklyTotal * 4.33,
    yearlyTotal: weeklyTotal * 52
  };
};