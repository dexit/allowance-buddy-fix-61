export interface WeekInterval {
  start: number;
  end: number;
}

export interface ChildFormData {
  id: string;
  ageGroup: AgeGroup;
  isSpecialCare: boolean;
  weekIntervals: WeekInterval[];
  region: Region;
}

export interface UserInfoFormData {
  name: string;
  email: string;
  phone: string;
  isExperiencedCarer: boolean;
}

export type AgeGroup = "0-2" | "3-4" | "5-10" | "11-15" | "16-17";
export type Region = "London" | "South East" | "Rest of England";