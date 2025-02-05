
import * as z from "zod";

export const userInfoFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  postcode: z.string().min(6, "Please enter a valid postcode"),
  address: z.string().optional(),
  isExperiencedCarer: z.boolean(),
  ageGroup: z.string().optional(),
  region: z.string().optional()
});

export type UserInfoFormData = z.infer<typeof userInfoFormSchema>;

export interface FieldConfig {
  hidden?: boolean;
}

export interface FormConfig {
  firstName?: FieldConfig;
  lastName?: FieldConfig;
  email?: FieldConfig;
  phone?: FieldConfig;
  postcode?: FieldConfig;
  ageGroup?: FieldConfig;
  region?: FieldConfig;
  careType?: FieldConfig;
}
