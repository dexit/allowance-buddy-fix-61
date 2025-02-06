
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UserInfoFormData } from "@/lib/form-schemas";
import InputMask from 'react-input-mask';
import { lookupPostcode } from "@/lib/form-utils";

interface PostcodeFieldProps {
  form: UseFormReturn<UserInfoFormData>;
  isLoading?: boolean;
  config?: {
    postcode?: { hidden?: boolean };
  };
  onAddressResolved: (address: string) => void;
}

export function PostcodeField({ form, isLoading, config, onAddressResolved }: PostcodeFieldProps) {
  if (config?.postcode?.hidden) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="postcode"
      render={({ field: { ref, onChange, onBlur, ...field } }) => (
        <FormItem>
          <FormLabel className="text-base font-medium text-gray-900">Postcode</FormLabel>
          <FormControl>
            <InputMask
              {...field}
              onChange={(e) => {
                // Store raw value during typing
                const rawValue = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                onChange(rawValue);
              }}
              onBlur={async (e) => {
                const value = e.target.value.trim();
                onBlur();
                
                // Format postcode on blur
                if (value.length >= 6) {
                  try {
                    const address = await lookupPostcode(value);
                    if (address) {
                      onAddressResolved(address);
                    }
                  } catch (error) {
                    console.error('Error looking up postcode:', error);
                  }
                }
              }}
              mask="aa*9[9] 9aa"
              maskChar={null}
              formatChars={{
                'a': '[A-Za-z]',
                '9': '[0-9]',
                '*': '[0-9A-Za-z]'
              }}
              disabled={isLoading}
            >
              {(inputProps: any) => (
                <Input
                  {...inputProps}
                  ref={ref}
                  className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white uppercase"
                  placeholder="Enter your postcode"
                />
              )}
            </InputMask>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
