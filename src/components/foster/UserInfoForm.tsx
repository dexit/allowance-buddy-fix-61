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

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  postcode: z.string().min(6, "Please enter a valid postcode"),
  address: z.string().optional(),
  isExperiencedCarer: z.boolean()
});

export type UserInfoFormData = z.infer<typeof formSchema>;

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormData) => void;
  isLoading?: boolean;
}

export function UserInfoForm({ onSubmit, isLoading }: UserInfoFormProps) {
  const [resolvedAddress, setResolvedAddress] = useState<string>("");
  
  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      postcode: "",
      address: "",
      isExperiencedCarer: false
    }
  });

  const formatPhoneNumber = (value: string) => {
    if (value.startsWith('0')) {
      return value.replace(/^0/, '+44 ');
    }
    if (value.startsWith('+44')) {
      return value;
    }
    return value;
  };

  const lookupPostcode = async (postcode: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&country=GB&postalcode=${postcode}`);
      const data = await response.json();
      if (data && data[0]) {
        setResolvedAddress(data[0].display_name);
        form.setValue('address', data[0].display_name);
      }
    } catch (error) {
      console.error('Error looking up postcode:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">Phone Number</FormLabel>
                <FormControl>
                  <InputMask
                    {...field}
                    mask={field.value.startsWith('+44') ? '+44 999 999 9999' : '09999 999999'}
                    maskChar="_"
                    value={formatPhoneNumber(field.value)}
                    disabled={isLoading}
                  >
                    {(inputProps: any) => (
                      <Input
                        {...inputProps}
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

          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">Postcode</FormLabel>
                <FormControl>
                  <InputMask
                    {...field}
                    mask="aa9 9aa"
                    maskChar="_"
                    formatChars={{
                      '9': '[0-9]',
                      'a': '[A-Za-z]'
                    }}
                    onBlur={(e) => {
                      field.onBlur();
                      if (e.target.value.replace(/_/g, '').length >= 6) {
                        lookupPostcode(e.target.value);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {(inputProps: any) => (
                      <Input
                        {...inputProps}
                        className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                        placeholder="Enter your postcode"
                      />
                    )}
                  </InputMask>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {resolvedAddress && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p>Resolved Address: {resolvedAddress}</p>
            </div>
          )}

          <FormField
            control={form.control}
            name="isExperiencedCarer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">Foster Care Experience</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={(value) => field.onChange(value === "experienced")}
                  value={field.value ? "experienced" : "new"}
                >
                  <SelectTrigger className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Foster Carer</SelectItem>
                    <SelectItem value="experienced">Experienced Foster Carer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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