import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  isExperiencedCarer: z.boolean()
});

export type UserInfoFormData = z.infer<typeof formSchema>;

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormData) => void;
  isLoading?: boolean;
}

export function UserInfoForm({ onSubmit, isLoading }: UserInfoFormProps) {
  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      isExperiencedCarer: false
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={isLoading}
                    className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium text-gray-900">Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    {...field} 
                    disabled={isLoading}
                    className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                    placeholder="Enter your email address"
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
                  <Input 
                    type="tel" 
                    {...field} 
                    disabled={isLoading}
                    className="h-11 text-base bg-gray-50 border-gray-200 focus:bg-white"
                    placeholder="Enter your phone number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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