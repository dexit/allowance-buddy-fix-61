interface AllowanceRates {
  baseRate: number;
  ageRates: {
    [key: string]: number;
  };
}

interface ChildAllowance {
  age: number;
  baseAllowance: number;
  ageRelatedElement: number;
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
  }
};

export const getAgeGroup = (age: number): string => {
  if (age <= 4) return "0-4";
  if (age <= 10) return "5-10";
  if (age <= 15) return "11-15";
  return "16-17";
};

export const calculateAllowanceForChild = (age: number): ChildAllowance => {
  const ageGroup = getAgeGroup(age);
  const baseAllowance = ALLOWANCE_RATES.baseRate;
  const ageRelatedElement = ALLOWANCE_RATES.ageRates[ageGroup];
  const totalAllowance = baseAllowance + ageRelatedElement;

  return {
    age,
    baseAllowance,
    ageRelatedElement,
    totalAllowance
  };
};

export const calculateTotalAllowance = (ages: number[]): TotalAllowance => {
  const children = ages.map(age => calculateAllowanceForChild(age));
  const weeklyTotal = children.reduce((sum, child) => sum + child.totalAllowance, 0);
  
  return {
    children,
    weeklyTotal,
    monthlyTotal: weeklyTotal * 4.33, // Average weeks in a month
    yearlyTotal: weeklyTotal * 52
  };
};