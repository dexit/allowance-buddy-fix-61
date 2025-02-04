import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import InputMask from 'react-input-mask';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AGE_GROUPS, REGIONS } from "@/lib/calculator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
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

export type UserInfoFormData = z.infer<typeof formSchema>;

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormData) => void;
  isLoading?: boolean;
  config?: FormConfig;
}

interface FieldConfig {
  hidden?: boolean;
}

interface FormConfig {
  firstName?: FieldConfig;
  lastName?: FieldConfig;
  email?: FieldConfig;
  phone?: FieldConfig;
  postcode?: FieldConfig;
  ageGroup?: FieldConfig;
  region?: FieldConfig;
  careType?: FieldConfig;
}

export function UserInfoForm({ onSubmit, isLoading, config }: UserInfoFormProps) {
  const [resolvedAddress, setResolvedAddress] = useState<string>("");
  const { toast } = useToast();
  
  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postcode: "",
      address: "",
      isExperiencedCarer: false,
      region: "Rest of England",
      ageGroup: undefined
    }
  });

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const number = value.replace(/\D/g, '');
    
    if (number.startsWith('44')) {
      return `+44 ${number.slice(2, 5)} ${number.slice(5, 8)} ${number.slice(8)}`;
    } else if (number.startsWith('0')) {
      return number.replace(/(\d{5})(\d{6})/, '$1 $2');
    }
    return value;
  };

  const lookupPostcode = async (postcode: string) => {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      const data = await response.json();
      if (data.result) {
        const address = `${data.result.parish || ''} ${data.result.admin_district}, ${data.result.postcode}`;
        setResolvedAddress(address.trim());
        form.setValue('address', address.trim());
      }
    } catch (error) {
      console.error('Error looking up postcode:', error);
    }
  };

  const handleFormSubmit = async (data: UserInfoFormData) => {
    try {
      // Get current form config
      const { data: formConfig } = await supabase
        .from('form_config')
        .select('*')
        .single();

      // Store submission
      const { error: submissionError } = await supabase
        .from('form_submissions')
        .insert({
          form_config_id: formConfig?.id,
          user_info: data,
          status: 'pending'
        });

      if (submissionError) throw submissionError;

      onSubmit(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save form submission",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
              render={({ field: { ref, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-900">Phone Number</FormLabel>
                  <FormControl>
                    <InputMask
                      {...field}
                      mask={field.value.startsWith('+44') ? '+44 999 999 9999' : '09999 999999'}
                      maskChar={null}
                      value={formatPhoneNumber(field.value)}
                      disabled={isLoading}
                      alwaysShowMask={false}
                      beforeMaskedStateChange={({ nextState }) => {
                        const { value } = nextState;
                        return {
                          ...nextState,
                          value: value.replace(/[^0-9+\s]/g, '')
                        };
                      }}
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

          {!config?.postcode?.hidden && (
            <FormField
              control={form.control}
              name="postcode"
              render={({ field: { ref, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-900">Postcode</FormLabel>
                  <FormControl>
                    <InputMask
                      {...field}
                      mask="aa9[9] 9aa"
                      maskChar={null}
                      formatChars={{
                        'a': '[A-Za-z]',
                        '9': '[0-9]'
                      }}
                      beforeMaskedStateChange={({ nextState }) => {
                        const { value } = nextState;
                        return {
                          ...nextState,
                          value: value.toUpperCase()
                        };
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        const value = e.target.value.trim();
                        if (value.length >= 6) {
                          lookupPostcode(value);
                        }
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
          )}

          {resolvedAddress && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p>Resolved Address: {resolvedAddress}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
