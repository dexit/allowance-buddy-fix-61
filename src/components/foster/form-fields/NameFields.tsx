
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserInfoFormData } from "@/lib/form-schemas";

interface NameFieldsProps {
  form: UseFormReturn<UserInfoFormData>;
  isLoading?: boolean;
  config?: {
    firstName?: { hidden?: boolean };
    lastName?: { hidden?: boolean };
  };
}

export function NameFields({ form, isLoading, config }: NameFieldsProps) {
  if (config?.firstName?.hidden && config?.lastName?.hidden) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {!config?.firstName?.hidden && (
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-900">First Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={isLoading}
                  className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                  placeholder="Enter your first name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {!config?.lastName?.hidden && (
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-900">Last Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={isLoading}
                  className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                  placeholder="Enter your last name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
