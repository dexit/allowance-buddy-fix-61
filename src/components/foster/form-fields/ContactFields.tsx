
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserInfoFormData } from "@/lib/form-schemas";
import InputMask from 'react-input-mask';
import { formatPhoneNumber } from "@/lib/form-utils";

interface ContactFieldsProps {
  form: UseFormReturn<UserInfoFormData>;
  isLoading?: boolean;
  config?: {
    email?: { hidden?: boolean };
    phone?: { hidden?: boolean };
  };
}

export function ContactFields({ form, isLoading, config }: ContactFieldsProps) {
  if (config?.email?.hidden && config?.phone?.hidden) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {!config?.email?.hidden && (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-900">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {!config?.phone?.hidden && (
        <FormField
          control={form.control}
          name="phone"
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormItem>
              <FormLabel className="text-base font-medium text-gray-900">Phone Number</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  onChange={(e) => {
                    // Only store raw numbers during typing
                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                    onChange(rawValue);
                  }}
                  onBlur={(e) => {
                    // Format the number when the field loses focus
                    const formattedValue = formatPhoneNumber(field.value);
                    onChange(formattedValue);
                    onBlur();
                  }}
                  mask={field.value.startsWith('+44') ? '+44 9999 999 9999' : '9999999999'}
                  maskChar={null}
                  disabled={isLoading}
                  alwaysShowMask={false}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      ref={ref}
                      type="tel"
                      className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                      placeholder="Enter your phone number"
                    />
                  )}
                </InputMask>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
